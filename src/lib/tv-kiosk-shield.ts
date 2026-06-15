import type { DynamicCarouselItem } from '@/components/custom/DynamicTimerCarousel'

const DEFAULT_SLIDE_DURATION_MS = 30000
const MIN_STALL_THRESHOLD_MS = 90000
const STALL_DURATION_MULTIPLIER = 2.5
const STALL_BUFFER_MS = 15000

export const NIGHTLY_TV_RELOAD_HOUR = 3
export const NIGHTLY_TV_RELOAD_MINUTE = 0

export const readSlideDurationMs = (item: DynamicCarouselItem | undefined): number => {
  if (!item?.duration || item.duration <= 0) {
    return DEFAULT_SLIDE_DURATION_MS
  }

  return item.duration
}

export const computeSlideStallThresholdMs = (item: DynamicCarouselItem | undefined): number => {
  const expectedDuration = readSlideDurationMs(item)
  return Math.max(expectedDuration * STALL_DURATION_MULTIPLIER + STALL_BUFFER_MS, MIN_STALL_THRESHOLD_MS)
}

export const isSlideStalled = (
  stalledForMs: number,
  item: DynamicCarouselItem | undefined,
): boolean => {
  return stalledForMs >= computeSlideStallThresholdMs(item)
}

export const shouldRunNightlyTvReload = (
  date: Date,
  lastReloadDateKey: string | null,
): { shouldReload: boolean; dateKey: string } => {
  const dateKey = date.toISOString().slice(0, 10)
  const hour = date.getHours()
  const minute = date.getMinutes()

  const isReloadWindow =
    hour === NIGHTLY_TV_RELOAD_HOUR &&
    minute >= NIGHTLY_TV_RELOAD_MINUTE &&
    minute < NIGHTLY_TV_RELOAD_MINUTE + 5

  return {
    shouldReload: isReloadWindow && lastReloadDateKey !== dateKey,
    dateKey,
  }
}
