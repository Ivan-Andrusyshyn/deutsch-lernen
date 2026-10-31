import { findPixabayImage } from '../src/server/pixabay-images';

export async function GET(request: Request): Promise<Response> {
  const apiKey = process.env['IMG_TOKEN'] || process.env['PIXABAY_API_KEY'];
  const query = new URL(request.url).searchParams.get('q');

  if (!apiKey) {
    return Response.json({ error: 'Photo search is not configured on the server.' }, { status: 503 });
  }
  if (!query || !/^[\p{L}\p{N}\s'-]{1,80}$/u.test(query.trim())) {
    return Response.json({ error: 'A valid photo search term is required.' }, { status: 400 });
  }

  const normalizedQuery = query.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');

  try {
    const image = await findPixabayImage(normalizedQuery, apiKey);
    return Response.json(
      { image },
      { headers: { 'Cache-Control': 'private, max-age=86400' } },
    );
  } catch (error) {
    const rateLimited = error instanceof Error && error.message === 'rate-limit';
    console.error(`Pixabay image lookup failed (${rateLimited ? 'rate limited' : 'provider unavailable'}).`);
    return Response.json(
      {
        error: rateLimited
          ? 'Photo search limit reached. Please try again later.'
          : 'Photo provider is temporarily unavailable.',
      },
      { status: rateLimited ? 429 : 502 },
    );
  }
}
