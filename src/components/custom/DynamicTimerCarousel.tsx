import React, { useState, useEffect, useLayoutEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  findFirstRenderableIndex,
  findNextRenderableIndex,
  findPreviousPlayableIndex,
  isRenderableCarouselItem,
  resolveRenderableIndexAfterItemsChange,
  validateRenderablePointer,
} from '@/lib/carousel-pointer';
import {
  findFirstRenderablePptIndex,
  findNextRenderablePptIndex,
  findNextTvSlideIndex,
  resolveTvIndexAfterItemsChange,
  validateTvCarouselPointer,
} from '@/lib/tv-ppt-fallback';
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
  /** Índices dos 8 PPTs no layout da TV — força retorno aos slides institucionais em nós vazios */
  pptFallbackIndices?: number[];
  /** Bloqueia slots fora do horário (Looker/aniversário) mesmo que tenham conteúdo montado */
  isSlideIndexAllowed?: (index: number) => boolean;
}

export interface DynamicTimerCarouselHandle {
  skipToNextPlayable: () => void;
  recoverToSafeIndex: () => void;
  recoverToPptFallback: () => void;
  /** Avança para o próximo slide agendado (Looker/aniversário) dentro da janela de horário */
  advanceToNextScheduledSlide: () => void;
  /** Vai direto para um índice do layout (ex.: primeiro Looker) se permitido e renderizável */
  goToLayoutIndex: (index: number) => void;
  getActiveIndex: () => number;
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
  pptFallbackIndices,
  isSlideIndexAllowed,
}, ref) {
  const pptFallbackRef = useRef(pptFallbackIndices);
  pptFallbackRef.current = pptFallbackIndices;
  const isSlideIndexAllowedRef = useRef(isSlideIndexAllowed);
  isSlideIndexAllowedRef.current = isSlideIndexAllowed;

  const resolvePointer = useCallback((carouselItems: DynamicCarouselItem[], index: number) => {
    if (pptFallbackRef.current?.length) {
      return validateTvCarouselPointer(
        carouselItems,
        index,
        pptFallbackRef.current,
        isSlideIndexAllowedRef.current,
      );
    }
    return validateRenderablePointer(carouselItems, index);
  }, []);

  const resolveInitialIndex = useCallback((carouselItems: DynamicCarouselItem[]) => {
    if (pptFallbackRef.current?.length) {
      return findFirstRenderablePptIndex(carouselItems, pptFallbackRef.current);
    }
    return findFirstRenderableIndex(carouselItems);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(() => resolveInitialIndex(items));
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
  const activeIndex = resolvePointer(items, boundedIndex).safeIndex;
  const activeItem = items[activeIndex];
  const activeDuration = activeItem?.duration && activeItem.duration > 0
    ? activeItem.duration
    : DEFAULT_SLIDE_DURATION_MS;

  const commitIndex = useCallback((nextIndex: number) => {
    const safeIndex = resolvePointer(itemsRef.current, nextIndex).safeIndex;
    setCurrentIndex(safeIndex);
    onSlideChangeRef.current?.(safeIndex);
  }, [resolvePointer]);

  const commitIndexRef = useRef(commitIndex);
  commitIndexRef.current = commitIndex;

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

    const remappedIndex = pptFallbackRef.current?.length
      ? resolveTvIndexAfterItemsChange(
        previousItems,
        boundedIndex,
        items,
        pptFallbackRef.current,
        isSlideIndexAllowedRef.current,
      )
      : resolveRenderableIndexAfterItemsChange(previousItems, boundedIndex, items);
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

    const boundedTarget = Math.min(Math.max(index, 0), currentItems.length - 1);
    const targetIndex = isRenderableCarouselItem(currentItems[boundedTarget])
      ? boundedTarget
      : pptFallbackRef.current?.length
        ? findNextRenderablePptIndex(currentItems, boundedTarget, pptFallbackRef.current)
        : findNextRenderableIndex(currentItems, boundedTarget);

    commitIndex(targetIndex);
  }, [commitIndex]);

  const goToNext = useCallback(() => {
    const currentItems = itemsRef.current;
    if (currentItems.length <= 1) {
      return;
    }

    const current = resolvePointer(
      currentItems,
      Math.min(Math.max(currentIndex, 0), currentItems.length - 1),
    ).safeIndex;

    if (pptFallbackRef.current?.length && !isRenderableCarouselItem(currentItems[current])) {
      commitIndex(findNextRenderablePptIndex(currentItems, current, pptFallbackRef.current));
      return;
    }

    let nextIndex = pptFallbackRef.current?.length
      ? findNextTvSlideIndex(
        currentItems,
        current,
        pptFallbackRef.current,
        isSlideIndexAllowedRef.current,
      )
      : findNextRenderableIndex(currentItems, current);

    if (!isRenderableCarouselItem(currentItems[nextIndex])) {
      nextIndex = pptFallbackRef.current?.length
        ? findNextRenderablePptIndex(currentItems, current, pptFallbackRef.current)
        : resolvePointer(currentItems, nextIndex).safeIndex;
    }

    commitIndex(nextIndex);
  }, [commitIndex, currentIndex, resolvePointer]);

  const recoverToPptFallback = useCallback(() => {
    const currentItems = itemsRef.current;
    const current = Math.min(Math.max(currentIndex, 0), currentItems.length - 1);

    if (pptFallbackRef.current?.length) {
      commitIndex(findNextRenderablePptIndex(currentItems, current, pptFallbackRef.current));
      return;
    }

    commitIndex(resolvePointer(currentItems, current).safeIndex);
  }, [commitIndex, currentIndex, resolvePointer]);

  const goToPrevious = useCallback(() => {
    const currentItems = itemsRef.current;
    if (currentItems.length <= 1) {
      return;
    }

    const current = resolvePointer(
      currentItems,
      Math.min(Math.max(currentIndex, 0), currentItems.length - 1),
    ).safeIndex;

    commitIndex(findPreviousPlayableIndex(currentItems, current));
  }, [commitIndex, currentIndex, resolvePointer]);

  const skipToNextPlayable = useCallback(() => {
    goToNext();
  }, [goToNext]);

  const recoverToSafeIndex = useCallback(() => {
    const currentItems = itemsRef.current;
    const current = Math.min(Math.max(currentIndex, 0), currentItems.length - 1);
    commitIndex(resolvePointer(currentItems, current).safeIndex);
  }, [commitIndex, currentIndex, resolvePointer]);

  const advanceToNextScheduledSlide = useCallback(() => {
    const currentItems = itemsRef.current;
    if (currentItems.length <= 1 || !pptFallbackRef.current?.length) {
      goToNext();
      return;
    }

    const current = resolvePointer(
      currentItems,
      Math.min(Math.max(currentIndex, 0), currentItems.length - 1),
    ).safeIndex;
    const pptIndices = pptFallbackRef.current;
    let walkFrom = current;

    for (let step = 0; step < currentItems.length; step += 1) {
      const candidate = findNextTvSlideIndex(
        currentItems,
        walkFrom,
        pptIndices,
        isSlideIndexAllowedRef.current,
      );

      const isScheduledSlot = !pptIndices.includes(candidate);
      const allowed = isSlideIndexAllowedRef.current?.(candidate) ?? true;

      if (
        isScheduledSlot &&
        allowed &&
        isRenderableCarouselItem(currentItems[candidate])
      ) {
        commitIndex(candidate);
        return;
      }

      if (candidate === current) {
        break;
      }

      walkFrom = candidate;
    }

    goToNext();
  }, [commitIndex, currentIndex, goToNext, resolvePointer]);

  const goToLayoutIndex = useCallback((targetIndex: number) => {
    const currentItems = itemsRef.current;
    if (currentItems.length === 0) {
      return;
    }

    const boundedTarget = Math.min(Math.max(targetIndex, 0), currentItems.length - 1);
    const allowed = isSlideIndexAllowedRef.current?.(boundedTarget) ?? true;

    if (allowed && isRenderableCarouselItem(currentItems[boundedTarget])) {
      commitIndex(boundedTarget);
      return;
    }

    if (pptFallbackRef.current?.length) {
      goToNext();
    }
  }, [commitIndex, goToNext]);

  useImperativeHandle(ref, () => ({
    skipToNextPlayable,
    recoverToSafeIndex,
    recoverToPptFallback,
    advanceToNextScheduledSlide,
    goToLayoutIndex,
    getActiveIndex: () => activeIndex,
  }), [activeIndex, advanceToNextScheduledSlide, goToLayoutIndex, recoverToPptFallback, recoverToSafeIndex, skipToNextPlayable]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isPaused || items.length <= 1 || !activeItem || !isRenderableCarouselItem(activeItem)) {
      return;
    }

    timerRef.current = setTimeout(() => {
      const currentItems = itemsRef.current;
      const current = resolvePointer(
        currentItems,
        Math.min(Math.max(currentIndex, 0), currentItems.length - 1),
      ).safeIndex;

      let nextIndex = pptFallbackRef.current?.length
        ? findNextTvSlideIndex(
          currentItems,
          current,
          pptFallbackRef.current,
          isSlideIndexAllowedRef.current,
        )
        : findNextRenderableIndex(currentItems, current);

      if (!isRenderableCarouselItem(currentItems[nextIndex])) {
        nextIndex = pptFallbackRef.current?.length
          ? findNextRenderablePptIndex(currentItems, current, pptFallbackRef.current)
          : resolvePointer(currentItems, nextIndex).safeIndex;
      }

      commitIndexRef.current(nextIndex);
    }, activeDuration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeIndex, activeDuration, activeItem, currentIndex, isPaused, items.length, resolvePointer]);

  useEffect(() => {
    const watchdogId = window.setInterval(() => {
      const currentItems = itemsRef.current;
      if (currentItems.length === 0) {
        return;
      }

      const bounded = Math.min(Math.max(currentIndex, 0), currentItems.length - 1);
      const currentItem = currentItems[bounded];
      const allowed = isSlideIndexAllowedRef.current?.(bounded) ?? true;

      if (!allowed || !isRenderableCarouselItem(currentItem)) {
        const validation = resolvePointer(currentItems, bounded);
        commitIndexRef.current(validation.safeIndex);
      }
    }, 300);

    return () => {
      window.clearInterval(watchdogId);
    };
  }, [currentIndex]);

  useEffect(() => {
    const allowed = isSlideIndexAllowedRef.current?.(activeIndex) ?? true;
    if (activeItem && isRenderableCarouselItem(activeItem) && allowed) {
      return;
    }

    const recoveryTimer = window.setTimeout(() => {
      if (pptFallbackRef.current?.length) {
        recoverToSafeIndex();
        return;
      }
      goToNext();
    }, 0);

    return () => {
      window.clearTimeout(recoveryTimer);
    };
  }, [activeIndex, activeItem, goToNext, recoverToSafeIndex]);

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

  if (!activeItem || !isRenderableCarouselItem(activeItem)) {
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
