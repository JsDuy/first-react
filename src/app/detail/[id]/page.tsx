import Link from "next/link";
import { MovieDetails, ErrorResponse, VideoResult } from '@/types/detailFilm'

async function fetchMovieDetails(id: string): Promise<MovieDetails | ErrorResponse> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return { error: "TMDB_API_KEY not found in environment variables" };
  }

  // Gọi API chi tiết phim và hình ảnh song song
  const movieUrl = `https://api.themoviedb.org/3/movie/${id}?language=vi&api_key=${apiKey}&append_to_response=videos,credits`;
  const imagesUrl = `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}&include_image_language=vi,en,null`;
   const trailersUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`;
  const options = {
    method: "GET" as const,
    headers: {
      accept: "application/json",
    },
  };

  try {
    const [movieRes, imagesRes, trailersRes] = await Promise.all([
      fetch(movieUrl, { ...options, cache: "no-store" }),
      fetch(imagesUrl, { ...options, cache: "no-store" }),
      fetch(trailersUrl, { ...options, cache: "no-store"})
    ]);

    // Kiểm tra phản hồi từ API chi tiết phim
    if (!movieRes.ok) {
      const errorBody = await movieRes.json();
      return { error: `HTTP error! Status: ${movieRes.status} - ${errorBody.status_message || "Unknown error"}` };
    }
    const movieData = await movieRes.json();

    // Kiểm tra phản hồi từ API hình ảnh
    if (!imagesRes.ok) {
      const errorBody = await imagesRes.json();
      return { error: `HTTP error! Status: ${imagesRes.status} - ${errorBody.status_message || "Unknown error"}` };
    }
    const imagesData = await imagesRes.json();

    //Kiểm tra phản hồi từ API trailer
    if(!trailersRes.ok) {
        const errorBody = await trailersRes.json();
        return { error: `HTTP error! Status: ${trailersRes.status} - ${errorBody.status_message || "Unknown error"}`}
    }
    const trailerData = await trailersRes.json();

// // Đảm bảo videos là mảng các đối tượng video
    const videos = trailerData.results
      ? trailerData.results.map((result: VideoResult) => ({
          id: trailerData.id,
          result: [result], // Mỗi video được bọc trong một mảng result
        }))
      : [];

    // Kết hợp dữ liệu
    return {
      ...movieData,
      images: {
        backdrops: imagesData.backdrops || [],
        posters: imagesData.posters || [],
        logos: imagesData.logos || [],
      },
      videos: videos,
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return { error: (err as Error).message };
  }
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const nowStyle = {
    boxShadow: "2px 2px 10px white",
    borderRadius: "20px",
  };

  const { id } = await params;
    const data = await fetchMovieDetails(id);

  if ("error" in data) {
    return (
      <div className="w-97/100 mx-auto p-6 mt-5 min-h-screen" style={nowStyle}>
        <h1 className="text-3xl font-semibold text-center mb-4 mt-5">
          <strong>ERROR</strong>
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Error: {data.error}</p>
        </div>
        <Link href="/now-playing" className="text-blue-600 hover:underline">
          Quay lại danh sách phim
        </Link>
      </div>
    );
  }

// Lấy tất cả video
  const allVideos = data.videos?.flatMap((videoGroup) => videoGroup.result) || [];

  // Lấy đạo diễn từ credits.crew
  const director = data.credits.crew.find((crew) => crew.job === "Director");

  return (
    <div className="w-97/100 mx-auto p-6 mt-5 min-h-screen" style={nowStyle}>
      <h1 className="text-[70px] uppercase font-semibold text-center mb-4 mt-5">
        <strong>{data.title}</strong>
      </h1>
      <Link href="/nowplaying" className="text-yellow-300 hover:underline mb-4 inline-block text-xl">
        Quay lại danh sách phim
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột bên trái: Poster và thông tin chính */}
        <div>
          {data.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
              alt={data.title}
              className="w-full h-auto rounded-lg mb-4 duration-300 hover:shadow-[0_0_10px_white]"
            />
          )}
          <h2 className="text-2xl font-bold">{data.original_title}</h2>
          <p className="text-md italic text-gray-400">{data.tagline}</p>
          <p className="text-md mt-2">{data.overview}</p>
          <p className="text-md font-medium text-yellow-400 mt-2">Rating: {data.vote_average.toFixed(1)}/10 ({data.vote_count} votes)</p>
          <p className="text-md mt-2 mb-4">Popularity: {data.popularity.toFixed(1)}</p>
          {data.images.backdrops.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-4 mb-2">Hình ảnh</h3>
              <div className="grid lg:grid-cols-3 gap-2">
                {data.images.backdrops.slice(0, 39).map((image, index) => (
                  <img
                    key={index}
                    src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                    alt={`Backdrop ${index + 1}`}
                    className="w-full h-auto rounded-lg duration-300 hover:shadow-[0_0_10px_white]"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cột bên phải: Thông tin chi tiết */}
        <div>
          <div className="border border-white rounded-xl p-5">
              <h3 className="text-xl font-semibold mb-2">Thông tin chi tiết</h3>
              <p><strong>Ngày phát hành:</strong> {data.release_date}</p>
              <p><strong>Thời lượng:</strong> {data.runtime} phút</p>
              <p><strong>Thể loại:</strong> {data.genres.map((genre) => genre.name).join(", ")}</p>
              <p><strong>Ngôn ngữ:</strong> {data.spoken_languages.map((lang) => lang.name).join(", ")}</p>
              <p><strong>Trạng thái:</strong> {data.status}</p>
              <p><strong>Ngân sách:</strong> {data.budget ? `$${data.budget.toLocaleString()}` : "N/A"}</p>
              <p><strong>Doanh thu:</strong> {data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A"}</p>
              <p><strong>Công ty sản xuất:</strong> {data.production_companies.map((company) => company.name).join(", ")}</p>
              <p><strong>Quốc gia:</strong> {data.production_countries.map((country) => country.name).join(", ")}</p>
              {director && <p><strong>Đạo diễn:</strong> {director.name}</p>}

              {/* Diễn viên */}
              <h3 className="text-xl font-semibold mt-4 mb-2">Diễn viên</h3>
              <div className="grid grid-cols-3 gap-4">
                {data.credits.cast.slice(0, 6).map((actor) => (
                  <div key={actor.id} className="flex items-center">
                    {actor.profile_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                        alt={actor.name}
                        className="rounded-sm mr-2"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          {allVideos.length > 0 && (
          <>
            <h3 className="uppercase text-2xl font-semibold mt-4 mb-2 text-right font-bold">Trailers</h3>
            <div className="space-y-4">
              {allVideos.slice(0, 5).map((video, index) => (
                <div key={index} className="relative" style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}>
                  {video.site === "YouTube" && (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              ))}
            </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}