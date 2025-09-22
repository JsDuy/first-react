import { TMDbResponse, ErrorResponse } from "@/types/movie";

export async function fetchTMDbMovies(page: number = 1): Promise<TMDbResponse | ErrorResponse> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return { error: 'TMDB_API_KEY not found in environment variables!' };
  }

  const url = `https://api.themoviedb.org/3/movie/now_playing?language=vi&api_key=${apiKey}&page=${page}`;
  const options = {
    method: 'GET' as const,
    headers: {
      accept: 'application/json',
    },
  };

  console.log('Calling URL:', url);
  console.log('API Key exists:', !!apiKey);

  try {
    const res = await fetch(url, { ...options, cache: 'no-store' });
    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(`HTTP error! Status: ${res.status} - ${errorBody.status_message || 'Unknown error'}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    return { error: (err as Error).message };
  }
}
