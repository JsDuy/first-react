import { Suspense } from 'react'
import MovieSlider from "@/components/SliderNow";

export default function home() {
  return (
    <Suspense fallback={<>...</>}>
      <MovieSlider />
    </Suspense>
  )
}
