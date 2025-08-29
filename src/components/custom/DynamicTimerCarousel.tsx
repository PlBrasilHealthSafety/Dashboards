import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DynamicCarouselItem {
  id: string | number;
  content: React.ReactNode;
  duration?: number; // Duration in milliseconds, defaults to 30000 (30 seconds)
}

export interface DynamicTimerCarouselProps {
  items: DynamicCarouselItem[];
  className?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  showProgressBar?: boolean;
  pauseOnMouseEnter?: boolean;
  onSlideChange?: (index: number) => void;
}

export const DynamicTimerCarousel: React.FC<DynamicTimerCarouselProps> = ({
  items,
  className,
  showNavigation = true,
  showPagination = true,
  showProgressBar = true,
  pauseOnMouseEnter = true,
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Drag/swipe functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentItem = items[currentIndex];
  const currentDuration = currentItem?.duration || 30000; // Default 30 seconds

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIndex);
    onSlideChange?.(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onSlideChange?.(prevIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  // Timer management
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer with current slide's duration
    timerRef.current = setTimeout(() => {
      goToNext();
    }, currentDuration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isPaused, currentDuration, items.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (pauseOnMouseEnter) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnMouseEnter) {
      setIsPaused(false);
    }
  };

  // Drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsPaused(true); // Pause timer while dragging
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    
    setCurrentX(clientX);
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    const threshold = 50; // Minimum drag distance to trigger slide change
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Dragged right - go to previous slide
        goToPrevious();
      } else {
        // Dragged left - go to next slide
        goToNext();
      }
    }
    
    // Reset drag state
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
    setDragOffset(0);
    
    // Resume timer if not hovering
    if (pauseOnMouseEnter) {
      setIsPaused(false);
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleDragMove(e.clientX);
      };

      const handleGlobalMouseUp = () => {
        handleDragEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, currentX, startX]);

  if (items.length === 0) {
    return <div className={cn('w-full h-full flex items-center justify-center', className)}>
      <p className="text-gray-500">No slides available</p>
    </div>;
  }

  return (
    <div 
      ref={containerRef}
      className={cn('relative w-full h-full overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Slide Content */}
      <div 
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0)',
          userSelect: 'none'
        }}
      >
        {currentItem.content}
      </div>

      {/* Navigation Arrows */}
      {showNavigation && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showPagination && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200',
                index === currentIndex
                  ? 'bg-white shadow-lg'
                  : 'bg-white/50 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Timer Progress Bar (optional visual indicator) */}
      {!isPaused && items.length > 1 && showProgressBar && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-10">
          <div 
            className="h-full bg-white/80 transition-all ease-linear"
            style={{
              width: '0%',
              animation: `progress ${currentDuration}ms linear forwards`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default DynamicTimerCarousel;