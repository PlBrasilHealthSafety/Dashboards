import React from 'react';
import { Carousel } from './Carousel';
import type { CarouselItem } from './Carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Basic Image Carousel
export const ImageCarousel: React.FC<{
  images: Array<{
    id: string | number;
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  className?: string;
}> = ({ images, className }) => {
  const items: CarouselItem[] = images.map((image) => ({
    id: image.id,
    content: (
      <div className="carousel-image-slide">
        <img src={image.src} alt={image.alt} />
        {(image.title || image.description) && (
          <div className="carousel-image-overlay">
            <div className="carousel-image-content">
              {image.title && <h3 className="carousel-image-title">{image.title}</h3>}
              {image.description && <p className="carousel-image-description">{image.description}</p>}
            </div>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <Carousel
      items={items}
      className={className}
      loop={true}
      autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
      showNavigation={true}
      showPagination={true}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 1 },
      }}
    />
  );
};

// Card Carousel
export const CardCarousel: React.FC<{
  cards: Array<{
    id: string | number;
    title: string;
    description: string;
    content?: React.ReactNode;
    badge?: string;
  }>;
  className?: string;
}> = ({ cards, className }) => {
  const items: CarouselItem[] = cards.map((card) => ({
    id: card.id,
    content: (
      <div className="carousel-card-slide">
        <Card className="carousel-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{card.title}</CardTitle>
              {card.badge && <Badge variant="secondary">{card.badge}</Badge>}
            </div>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          {card.content && <CardContent>{card.content}</CardContent>}
        </Card>
      </div>
    ),
  }));

  return (
    <Carousel
      items={items}
      className={className}
      slidesPerView="auto"
      spaceBetween={20}
      centeredSlides={false}
      showNavigation={true}
      showPagination={false}
      breakpoints={{
        640: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 15 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
        1280: { slidesPerView: 4, spaceBetween: 20 },
      }}
    />
  );
};

// Testimonial Carousel
export const TestimonialCarousel: React.FC<{
  testimonials: Array<{
    id: string | number;
    content: string;
    author: string;
    role: string;
    avatar?: string;
  }>;
  className?: string;
}> = ({ testimonials, className }) => {
  const items: CarouselItem[] = testimonials.map((testimonial) => ({
    id: testimonial.id,
    content: (
      <div className="carousel-testimonial">
        <blockquote className="carousel-testimonial-content">
          "{testimonial.content}"
        </blockquote>
        <div className="flex items-center justify-center space-x-3">
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <div className="carousel-testimonial-author">{testimonial.author}</div>
            <div className="carousel-testimonial-role">{testimonial.role}</div>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <Carousel
      items={items}
      className={className}
      loop={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      showNavigation={false}
      showPagination={true}
      effect="fade"
    />
  );
};

// Auto-play Carousel (Basic with autoplay)
export const AutoplayCarousel: React.FC<{
  items: CarouselItem[];
  className?: string;
  delay?: number;
}> = ({ items, className, delay = 3000 }) => {
  return (
    <Carousel
      items={items}
      className={className}
      loop={true}
      autoplay={{
        delay,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      showNavigation={true}
      showPagination={true}
    />
  );
};

// Multi-slide Carousel (Shows multiple slides at once)
export const MultiSlideCarousel: React.FC<{
  items: CarouselItem[];
  className?: string;
  slidesPerView?: number;
}> = ({ items, className, slidesPerView = 3 }) => {
  return (
    <Carousel
      items={items}
      className={className}
      slidesPerView={slidesPerView}
      spaceBetween={20}
      loop={false}
      showNavigation={true}
      showPagination={false}
      breakpoints={{
        640: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 15 },
        1024: { slidesPerView: slidesPerView, spaceBetween: 20 },
      }}
    />
  );
};