"use client";
import { useState, useEffect } from "react";
import { Movie, TMDbResponse, ErrorResponse } from "@/types/movie"; // Giả sử tách ra file types.ts
import Link from "next/link";

export async function fetchTMDbMovies(page: number = 1): Promise<TMDbResponse | ErrorResponse> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    return { error: 'NEXY_PUBLIC_TMDB_API_KEY not found in environment variables' };
  }

  const url = `https://api.themoviedb.org/3/movie/now_playing?language=vi&api_key=bf36e4b99bc1418a6567fd3273518444&page=${page}`;
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

export default function MovieSlider() {
  const [data, setData] = useState<TMDbResponse | ErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Thêm state cho page

  // Gọi API khi số trang thay đổi
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const result = await fetchTMDbMovies(page);
      setData(result);
      setLoading(false);
      // Cuộn về đầu trang sau khi dữ liệu được tải
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    loadMovies();
  }, [page]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (data && "error" in data) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p className="font-medium">Error: {data.error}</p>
      </div>
    );
  }

  const moviesToShow = data && "results" in data ? data.results.slice(0, 10) : [];

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">NOW PLAYING MOVIES</h2>
      <div className="relative overflow-x-auto scrollbar-hide">
        <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4">
          {moviesToShow.map((movie: Movie) => (
            <div key={movie.id} className="p-2">
              <div className="bg-[#1c1c1c] p-4 rounded-lg">
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-sm line-clamp-3">{movie.overview}</p>
                <p className="text-sm font-medium text-yellow-400">Rating: {movie.vote_average}/10</p>
                {movie.poster_path && (
                  <Link href={`/detail/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="mt-2 w-full h-auto rounded-lg duration-300 hover:shadow-[0_0_10px_white]"
                    />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {moviesToShow.length === 0 && <p className="text-center text-gray-600 mt-4">Không có phim nào.</p>}
    </div>
  );
}