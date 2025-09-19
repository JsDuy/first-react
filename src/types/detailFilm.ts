export interface MovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  tagline: string;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  budget: number;
  revenue: number;
  status: string;
  spoken_languages: { iso_639_1: string; name: string }[];
  production_companies: { id: number; name: string; logo_path?: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  poster_path?: string;
  backdrop_path?: string;
  credits: {
    cast: { id: number; name: string; character: string; profile_path?: string }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos: {
    id: number | string; // Cập nhật để hỗ trợ cả string từ trailerData.id
    result: VideoResult[];
  }[];
  images: {
    backdrops: { file_path: string; iso_639_1?: string }[];
    posters: { file_path: string; iso_639_1?: string }[];
    logos: { file_path: string; iso_639_1?: string }[];
  };
}

export interface VideoResult {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  type: string;
  published_at: string;
}

export interface ErrorResponse {
  error: string;
}