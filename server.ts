import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

interface PixabayHit {
  webformatURL: string;
  pageURL: string;
  tags: string;
}

interface CachedImage {
  image: { url: string; pageUrl: string; tags: string } | null;
  expiresAt: number;
}

const imageCache = new Map<string, CachedImage>();
const pendingImageSearches = new Map<string, Promise<CachedImage['image']>>();
const imageCacheLifetime = 24 * 60 * 60 * 1000;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/api/images', async (req, res) => {
    const apiKey = process.env['IMG_TOKEN'] || process.env['PIXABAY_API_KEY'];
    const query = req.query['q'];

    if (!apiKey) {
      res.status(503).json({ error: 'Photo search is not configured on the server.' });
      return;
    }
    if (typeof query !== 'string' || !/^[\p{L}\p{N}\s'-]{1,80}$/u.test(query.trim())) {
      res.status(400).json({ error: 'A valid photo search term is required.' });
      return;
    }

    const normalizedQuery = query.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');
    const cached = imageCache.get(normalizedQuery);
    if (cached && cached.expiresAt > Date.now()) {
      res.set('Cache-Control', 'private, max-age=86400').json({ image: cached.image });
      return;
    }
    if (cached) {
      imageCache.delete(normalizedQuery);
    }

    try {
      let search = pendingImageSearches.get(normalizedQuery);
      if (!search) {
        const parameters = new URLSearchParams({
          key: apiKey,
          q: normalizedQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: '3',
        });
        search = fetch(`https://pixabay.com/api/?${parameters}`, {
          signal: AbortSignal.timeout(10000),
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error(response.status === 429 ? 'rate-limit' : 'provider-error');
          }

          const payload: unknown = await response.json();
          const hits = getPixabayHits(payload);
          const hit = findMostRelevantHit(hits, normalizedQuery);
          const image = hit
            ? {
                url: hit.webformatURL,
                pageUrl: hit.pageURL,
                tags: hit.tags,
              }
            : null;

          if (
            image &&
            (!isPixabayUrl(image.url) || !isPixabayUrl(image.pageUrl))
          ) {
            throw new Error('invalid-image-url');
          }
          return image;
        });
        pendingImageSearches.set(normalizedQuery, search);
      }

      const image = await search;
      imageCache.set(normalizedQuery, { image, expiresAt: Date.now() + imageCacheLifetime });
      if (imageCache.size > 1000) {
        const oldestQuery = imageCache.keys().next().value;
        if (oldestQuery) {
          imageCache.delete(oldestQuery);
        }
      }
      res.set('Cache-Control', 'private, max-age=86400').json({ image });
    } catch (error) {
      const rateLimited = error instanceof Error && error.message === 'rate-limit';
      console.error(`Pixabay image lookup failed (${rateLimited ? 'rate limited' : 'provider unavailable'}).`);
      res.status(rateLimited ? 429 : 502).json({
        error: rateLimited ? 'Photo search limit reached. Please try again later.' : 'Photo provider is temporarily unavailable.',
      });
    } finally {
      pendingImageSearches.delete(normalizedQuery);
    }
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function isPixabayUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'pixabay.com' || url.hostname.endsWith('.pixabay.com'));
  } catch {
    return false;
  }
}

function getPixabayHits(payload: unknown): PixabayHit[] {
  if (!payload || typeof payload !== 'object' || !('hits' in payload) || !Array.isArray(payload.hits)) {
    return [];
  }

  return payload.hits.filter((hit: unknown): hit is PixabayHit => {
    if (!hit || typeof hit !== 'object') {
      return false;
    }

    return (
      'webformatURL' in hit &&
      typeof hit.webformatURL === 'string' &&
      'pageURL' in hit &&
      typeof hit.pageURL === 'string' &&
      'tags' in hit &&
      typeof hit.tags === 'string'
    );
  });
}

function findMostRelevantHit(hits: PixabayHit[], query: string): PixabayHit | undefined {
  const ignoredTerms = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'on', 'the', 'to', 'with']);
  const queryTerms = query
    .match(/\p{L}+/gu)
    ?.filter((term) => !ignoredTerms.has(term)) ?? [];
  let bestHit: PixabayHit | undefined;
  let bestScore = 0;

  for (const hit of hits) {
    const tagTerms = new Set(hit.tags.toLocaleLowerCase('en').match(/\p{L}+/gu) ?? []);
    const score = queryTerms.reduce(
      (total, term) => total + (hasMatchingTag(term, tagTerms) ? 1 : 0),
      0,
    );

    if (score > bestScore) {
      bestHit = hit;
      bestScore = score;
    }
  }

  return bestHit;
}

function hasMatchingTag(term: string, tagTerms: Set<string>): boolean {
  return (
    tagTerms.has(term) ||
    tagTerms.has(`${term}s`) ||
    tagTerms.has(`${term}es`) ||
    (term.endsWith('y') && tagTerms.has(`${term.slice(0, -1)}ies`)) ||
    (term.length > 3 && term.endsWith('s') && tagTerms.has(term.slice(0, -1))) ||
    (term.endsWith('ies') && tagTerms.has(`${term.slice(0, -3)}y`))
  );
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
