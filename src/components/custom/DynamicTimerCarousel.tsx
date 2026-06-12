import React, { useState, useEffect, useLayoutEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  findFirstPlayableIndex,
  findNextPlayableIndex,
  findPreviousPlayableIndex,
  resolveIndexAfterItemsChange,
  validateCarouselPointer,
} from '@/lib/carousel-pointer';
import { cn } from '@/lib/utils';

export interface DynamicCarouselItem {
  id: string | number;
  content: React.ReactNode;
  duration?: number; // Duration in milliseconds, defaults to 30000 (30 seconds)
  /** Avança imediatamente sem exibir o slide (ex.: Looker fora do horário) */
  autoSkip?: boolean;
}

export interface DynamicTimerCarouselProps {
  items: DynamicCarouselItem[];
  className?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  showProgressBar?: boolean;
  pauseOnMouseEnter?: boolean;
  preloadAhead?: number;
  onSlideChange?: (index: number) => void;
}

export interface DynamicTimerCarouselHandle {
  skipToNextPlayable: () => void;
  recoverToSafeIndex: () => void;
}

const DEFAULT_SLIDE_DURATION_MS = 30000;

export const DynamicTimerCarousel = forwardRef<DynamicTimerCarouselHandle, DynamicTimerCarouselProps>(function DynamicTimerCarousel({
  items,
  className,
  showNavigation = true,
  showPagination = true,
  showProgressBar = true,
  pauseOnMouseEnter = true,
  preloadAhead = 0,
  onSlideChange,
}, ref) {
  const [currentIndex, setCurrentIndex] = useState(() => findFirstPlayableIndex(items));
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSlideChangeRef = useRef(onSlideChange);
  const itemsRef = useRef(items);
  const previousItemsRef = useRef(items);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  itemsRef.current = items;

  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  const boundedIndex = items.length === 0 ? 0 : Math.min(Math.max(currentIndex, 0), items.length - 1);
  const activeIndex = validateCarouselPointer(items, boundedIndex).safeIndex;
  const activeItem = items[activeIndex];
  const activeDuration = activeItem?.duration && activeItem.duration > 0
    ? activeItem.duration
    : DEFAULT_SLIDE_DURATION_MS;

  const commitIndex = useCallback((nextIndex: number) => {
    const safeIndex = validateCarouselPointer(itemsRef.current, nextIndex).safeIndex;
    setCurrentIndex(safeIndex);
    onSlideChangeRef.current?.(safeIndex);
  }, []);

  useLayoutEffect(() => {
    if (activeIndex !== boundedIndex) {
      setCurrentIndex(activeIndex);
      onSlideChangeRef.current?.(activeIndex);
    }
  }, [activeIndex, boundedIndex]);

  useLayoutEffect(() => {
    const previousItems = previousItemsRef.current;
    if (previousItems === items) {
      return;
    }

    const remappedIndex = resolveIndexAfterItemsChange(previousItems, boundedIndex, items);
    previousItemsRef.current = items;

    if (remappedIndex !== boundedIndex) {
      setCurrentIndex(remappedIndex);
      onSlideChangeRef.current?.(remappedIndex);
    }
  }, [items, boundedIndex]);

  const goToIndex = useCallback((index: number) => {
    const currentItems = itemsRef.current;
    if (currentItems.length === 0) {
      return;
    }

    const boundedIndex = Math.min(Math.max(index, 0), currentItems.length - 1);
    const targetIndex = currentItems[boundedIndex]?.autoSkip
      ? findNextPlayableIndex(currentItems, boundedIndex)
      : boundedIndex;

    commitIndex(targetIndex);
  }, [commitIndex]);

  const goToNext = useCallback(() => {
    const currentItems = itemsRef.current;
    if (currentItems.length <= 1) {
      return;
    }

    const current = validateCarouselPointer(
      currentItems,
      Math.min(Math.max(currentIndex, 0), currentItems.length - 1),
    ).safeIndex;

    commitIndex(findNextPlayableIndex(currentItems, current));
  }, [commitIndex, currentIndex]);

  const goToPrevious = useCallback(() => {
    const currentItems = itemsRef.current;
    if (currentItems.length <= 1) {
      return;
    }

    const current = validateCarouselPointer(
      currentItems,
      Math.min(Math.max(currentIndex, 0), currentItems.length - 1),
    ).safeIndex;

    commitIndex(findPreviousPlayableIndex(currentItems, current));
  }, [commitIndex, currentIndex]);

  const skipToNextPlayable = useCallback(() => {
    goToNext();
  }, [goToNext]);

  const recoverToSafeIndex = useCallback(() => {
    const currentItems = itemsRef.current;
    const current = Math.min(Math.max(currentIndex, 0), currentItems.length - 1);
    commitIndex(validateCarouselPointer(currentItems, current).safeIndex);
  }, [commitIndex, currentIndex]);

  useImperativeHandle(ref, () => ({
    skipToNextPlayable,
    recoverToSafeIndex,
  }), [recoverToSafeIndex, skipToNextPlayable]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isPaused || items.length <= 1 || !activeItem || activeItem.autoSkip) {
      return;
    }

    timerRef.current = setTimeout(() => {
      const currentItems = itemsRef.current;
      const current = validateCarouselPointer(
        currentItems,
        Math.min(Math.max(currentIndex, 0), currentItems.length - 1),
      ).safeIndex;

      const nextIndex = findNextPlayableIndex(currentItems, current);
      setCurrentIndex(nextIndex);
      onSlideChangeRef.current?.(nextIndex);
    }, activeDuration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeIndex, activeDuration, activeItem, currentIndex, isPaused, items.length]);

  useEffect(() => {
    if (!activeItem || !activeItem.autoSkip) {
      return;
    }

    const recoveryTimer = window.setTimeout(() => {
      goToNext();
    }, 0);

    return () => {
      window.clearTimeout(recoveryTimer);
    };
  }, [activeIndex, activeItem, goToNext]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const shouldRenderSlide = (index: number) => {
    if (index === activeIndex) {
      return true;
    }

    if (preloadAhead <= 0 || items.length <= 1) {
      return false;
    }

    const distanceAhead = (index - activeIndex + items.length) % items.length;
    return distanceAhead > 0 && distanceAhead <= preloadAhead;
  };

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

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsPaused(true);
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
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
    setDragOffset(0);

    if (pauseOnMouseEnter) {
      setIsPaused(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

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
    return (
      <div className={cn('w-full h-full flex items-center justify-center bg-black', className)}>
        <p className="text-white/60">Nenhum slide disponível</p>
      </div>
    );
  }

  if (!activeItem || activeItem.autoSkip) {
    return (
      <div className={cn('w-full h-full flex items-center justify-center bg-black', className)}>
        <p className="text-white/60">Recuperando exibição...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full overflow-hidden bg-black', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0)',
          userSelect: 'none',
        }}
      >
        {items.map((item, index) => {
          if (!shouldRenderSlide(index)) {
            return null;
          }

          const isActive = index === activeIndex;

          return (
            <div
              key={item.id}
              className="absolute inset-0 w-full h-full"
              aria-hidden={!isActive}
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                visibility: isActive ? 'visible' : 'hidden',
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>

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

      {showPagination && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-200',
                index === activeIndex
                  ? 'bg-white shadow-lg'
                  : 'bg-white/50 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {!isPaused && items.length > 1 && showProgressBar && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-10">
          <div
            className="h-full bg-white/80 transition-all ease-linear"
            style={{
              width: '0%',
              animation: `progress ${activeDuration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
});

export default DynamicTimerCarousel;
