import { CarouselExample, ChartsExample, FramerMotionExample } from '@/components/examples'

export function ComponentsPage() {
  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold text-center">Component Examples</h2>
      
      {/* Carousel Examples */}
      <div>
        <CarouselExample />
      </div>
      
      {/* Charts Examples */}
      <div>
        <ChartsExample />
      </div>
      
      {/* Framer Motion Examples */}
      <div>
        <FramerMotionExample />
      </div>
    </div>
  )
}