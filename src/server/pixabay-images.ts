export interface VocabularyImage {
  url: string;
  pageUrl: string;
  tags: string;
}

interface PixabayHit {
  webformatURL: string;
  pageURL: string;
  tags: string;
}

interface CachedImage {
  image: VocabularyImage | null;
  expiresAt: number;
}

const imageCache = new Map<string, CachedImage>();
const pendingImageSearches = new Map<string, Promise<VocabularyImage | null>>();
const imageCacheLifetime = 24 * 60 * 60 * 1000;

export async function findPixabayImage(query: string, apiKey: string): Promise<VocabularyImage | null> {
  const cached = imageCache.get(query);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.image;
  }
  if (cached) {
    imageCache.delete(query);
  }

  let search = pendingImageSearches.get(query);
  if (!search) {
    const parameters = new URLSearchParams({
      key: apiKey,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: '10',
    });

    search = fetch(`https://pixabay.com/api/?${parameters}`, {
      signal: AbortSignal.timeout(10000),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(response.status === 429 ? 'rate-limit' : 'provider-error');
      }

      const payload: unknown = await response.json();
      const hit = findMostRelevantHit(getPixabayHits(payload), query);
      if (!hit) {
        return null;
      }

      const image = {
        url: hit.webformatURL,
        pageUrl: hit.pageURL,
        tags: hit.tags,
      };
      if (!isPixabayUrl(image.url) || !isPixabayUrl(image.pageUrl)) {
        throw new Error('invalid-image-url');
      }
      return image;
    });
    pendingImageSearches.set(query, search);
  }

  try {
    const image = await search;
    imageCache.set(query, { image, expiresAt: Date.now() + imageCacheLifetime });
    if (imageCache.size > 1000) {
      const oldestQuery = imageCache.keys().next().value;
      if (oldestQuery) {
        imageCache.delete(oldestQuery);
      }
    }
    return image;
  } finally {
    pendingImageSearches.delete(query);
  }
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
  const queryTerms = query.match(/\p{L}+/gu)?.filter((term) => !ignoredTerms.has(term)) ?? [];
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
