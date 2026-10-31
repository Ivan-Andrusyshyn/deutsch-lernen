import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { findPixabayImage } from './src/server/pixabay-images';

// The Express app serves Angular SSR and the local image API.
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
      res
        .status(503)
        .json({ error: 'Photo search is not configured on the server.' });
      return;
    }
    if (
      typeof query !== 'string' ||
      !/^[\p{L}\p{N}\s'-]{1,80}$/u.test(query.trim())
    ) {
      res.status(400).json({ error: 'A valid photo search term is required.' });
      return;
    }

    const normalizedQuery = query
      .trim()
      .replace(/\s+/g, ' ')
      .toLocaleLowerCase('en');

    try {
      const image = await findPixabayImage(normalizedQuery, apiKey);
      res.set('Cache-Control', 'private, max-age=86400').json({ image });
    } catch (error) {
      const rateLimited =
        error instanceof Error && error.message === 'rate-limit';
      console.error(
        `Pixabay image lookup failed (${rateLimited ? 'rate limited' : 'provider unavailable'}).`,
      );
      res.status(rateLimited ? 429 : 502).json({
        error: rateLimited
          ? 'Photo search limit reached. Please try again later.'
          : 'Photo provider is temporarily unavailable.',
      });
    }
  });

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    }),
  );

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

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
