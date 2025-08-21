import React from 'react'

// Componente base para slides de imagem
interface ImageSlideProps {
  imagePath: string
  altText: string
}

function ImageSlide({ imagePath, altText }: ImageSlideProps) {
  return (
    <div className="relative h-full w-full bg-white flex items-center justify-center overflow-hidden">
      <img 
        src={imagePath}
        alt={altText}
        className="max-w-full max-h-full object-contain"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  )
}

// Slides individuais do PowerPoint
export function PowerPointSlide1() {
  return <ImageSlide imagePath="/slides/slide-1.png" altText="Slide 1 da Apresentação PLBrasil" />
}

export function PowerPointSlide2() {
  return <ImageSlide imagePath="/slides/slide-2.png" altText="Slide 2 da Apresentação PLBrasil" />
}

export function PowerPointSlide3() {
  return <ImageSlide imagePath="/slides/slide-3.png" altText="Slide 3 da Apresentação PLBrasil" />
}

export function PowerPointSlide4() {
  return <ImageSlide imagePath="/slides/slide-4.png" altText="Slide 4 da Apresentação PLBrasil" />
}

export function PowerPointSlide5() {
  return <ImageSlide imagePath="/slides/slide-5.png" altText="Slide 5 da Apresentação PLBrasil" />
}

export function PowerPointSlide6() {
  return <ImageSlide imagePath="/slides/slide-6.png" altText="Slide 6 da Apresentação PLBrasil" />
}

export function PowerPointSlide7() {
  return <ImageSlide imagePath="/slides/slide-7.png" altText="Slide 7 da Apresentação PLBrasil" />
}

export function PowerPointSlide8() {
  return <ImageSlide imagePath="/slides/slide-8.png" altText="Slide 8 da Apresentação PLBrasil" />
}