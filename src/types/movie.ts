export interface Movie {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  poster_path?: string;
}

export interface TMDbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface ErrorResponse {
  error: string;
}