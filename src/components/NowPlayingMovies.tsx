'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Movie, TMDbResponse, ErrorResponse } from "@/types/movie";
import { Suspense } from 'react'

export default function NowPlaying() {
  const nowStyle = {
    boxShadow: "2px 2px 10px white",
    borderRadius: "20px",
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialQuery = searchParams.get('query') || '';

  const [data, setData] = useState<TMDbResponse | ErrorResponse | null>(null);
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);

  // Gọi API khi số trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/nowplaying?page=${page}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        setData({ error: (err as Error).message });
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    loadMovies();

    // Cập nhật URL với số trang và từ khóa tìm kiếm
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (searchQuery) {
      params.set('query', searchQuery);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [page, searchQuery, router]);

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && data && "total_pages" in data && newPage <= data.total_pages) {
      setPage(newPage);
    }
  };

  // Hàm xử lý thay đổi tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Tạo danh sách các nút phân trang
  const renderPagination = () => {
    if (!data || !("total_pages" in data)) return null;

    const totalPages = data.total_pages;
    const pages: (number | string)[] = [];

    // Thêm trang 1
    pages.push(1);

    // Thêm dấu ba chấm nếu trang hiện tại cách trang 1 hơn 3
    if (page > 3) {
      pages.push("...");
    }

    // Thêm 2 trang trước và 2 trang sau
    const startPage = Math.max(2, page - 2);
    const endPage = Math.min(totalPages - 1, page + 2);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Thêm dấu ba chấm nếu trang hiện tại cách trang cuối hơn 3
    if (page < totalPages - 2) {
      pages.push("...");
    }

    // Thêm trang cuối nếu totalPages > 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return (
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded text-black ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          Previous
        </button>

        {pages.map((p, index) => (
          <button
            key={index}
            onClick={() => typeof p === "number" && handlePageChange(p)}
            disabled={typeof p !== "number" || p === page}
            className={`px-4 py-2 rounded ${
              p === page
                ? "bg-blue-600 text-white"
                : typeof p === "number"
                ? "bg-gray-200 hover:bg-gray-300 text-black"
                : "bg-transparent cursor-default"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={data.total_pages ? page >= data.total_pages : true}
          className={`px-4 py-2 rounded ${data.total_pages && page < data.total_pages ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <Suspense>
      <h1 className="text-3xl font-semibold text-center mb-4 mt-5">
        <strong>{searchQuery ? "SEARCH RESULTS" : "ALL MOVIES"}</strong>: Page {page}
      </h1>
      <div className="w-97/100 mx-auto p-6 mt-5" style={nowStyle}>
        {/* Trường tìm kiếm */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm phim..."
            className="w-full max-w-md mx-auto p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {data && "error" in data && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error: {data.error}</p>
          </div>
        )}

        {data && "results" in data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.results.length === 0 && searchQuery && (
                <p className="text-center text-gray-600 col-span-full">Không tìm thấy phim nào.</p>
              )}
              {data.results.map((movie: Movie) => (
                <div key={movie.id} className="p-4 rounded-lg bg-[#1c1c1c]">
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p className="text-sm line-clamp-3">{movie.overview}</p>
                  <p className="text-sm font-medium text-yellow-400">Rating: {movie.vote_average}/10</p>
                  {movie.poster_path && (
                    <Link href={`/detail/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="mt-2 w-full h-auto duration-300 hover:rounded-xl ease-in-out hover:shadow-[0_0_10px_white]"
                    />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </Suspense>
  );
}