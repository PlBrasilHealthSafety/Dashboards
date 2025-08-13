import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { cn } from '@/lib/utils';

// Swiper styles are imported in index.css

export interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
  image?: string;
  title?: string;
  description?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  className?: string;
  // Basic configuration
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  loop?: boolean;
  centeredSlides?: boolean;
  
  // Navigation
  showNavigation?: boolean;
  showPagination?: boolean;
  
  // Autoplay
  autoplay?: boolean | {
    delay?: number;
    disableOnInteraction?: boolean;
    pauseOnMouseEnter?: boolean;
  };
  
  // Effects
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
  
  // Responsive breakpoints
  breakpoints?: {
    [key: number]: {
      slidesPerView?: number;
      spaceBetween?: number;
    };
  };
  
  // Event handlers
  onSlideChange?: (swiper: any) => void;
  onSwiper?: (swiper: any) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  className,
  slidesPerView = 1,
  spaceBetween = 30,
  loop = false,
  centeredSlides = false,
  showNavigation = true,
  showPagination = true,
  autoplay = false,
  effect = 'slide',
  breakpoints,
  onSlideChange,
  onSwiper,
}) => {
  // Configure modules based on props
  const modules = [Navigation, Pagination];
  
  if (autoplay) {
    modules.push(Autoplay);
  }
  
  if (effect !== 'slide') {
    modules.push(EffectFade);
  }

  // Configure autoplay settings
  const autoplayConfig = typeof autoplay === 'boolean' 
    ? (autoplay ? { delay: 3000, disableOnInteraction: false } : false)
    : autoplay;

  return (
    <div className={cn('w-full', className)}>
      <Swiper
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={loop}
        centeredSlides={centeredSlides}
        navigation={showNavigation}
        pagination={showPagination ? { clickable: true } : false}
        autoplay={autoplayConfig}
        effect={effect}
        breakpoints={breakpoints}
        onSlideChange={onSlideChange}
        onSwiper={onSwiper}
        className="carousel-swiper"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="carousel-slide">
            {item.content}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;