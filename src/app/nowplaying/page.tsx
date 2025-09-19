import NowPlaying from "@/components/NowPlayingMovies";
import { Suspense } from "react";


export default function NowPlayingPage() {
  return (
    <>
      <Suspense fallback={<div className="text-center">Đang tải phim...</div>}>
        <NowPlaying />
      </Suspense>
    </>
  )
}