import NowPlaying from "@/components/NowPlayingMovies";
import { Suspense } from "react";


export default function NowPlayingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  return (
    <>
      <Suspense fallback={<div className="text-center">Đang tải phim...</div>}>
        <NowPlaying />
      </Suspense>
    </>
  )
}