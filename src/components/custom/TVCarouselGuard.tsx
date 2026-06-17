import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import type { DynamicCarouselItem, DynamicTimerCarouselHandle } from '@/components/custom/DynamicTimerCarousel'
import { auditTvCarouselHealth } from '@/lib/tv-carousel-health'
import { buildTvHardReloadUrl } from '@/lib/tv-session-shield'

const HEALTH_CHECK_INTERVAL_MS = 8000
const MAX_RECOVERIES_BEFORE_HARD_RELOAD = 5
const HARD_RELOAD_WINDOW_MS = 120000

interface TVCarouselGuardProps {
  items: DynamicCarouselItem[]
  activeIndex: number
  carouselRef: RefObject<DynamicTimerCarouselHandle | null>
  isSlideIndexAllowed?: (slideIndex: number) => boolean
  children: ReactNode
}

/**
 * Vigia o carrossel da TV em runtime: valida ponteiros, detecta travamento
 * em slide vazio/autoSkip e força recuperação automática.
 */
export function TVCarouselGuard({
  items,
  activeIndex,
  carouselRef,
  isSlideIndexAllowed,
  children,
}: TVCarouselGuardProps) {
  const lastActiveIndexRef = useRef(activeIndex)
  const lastProgressAtRef = useRef(Date.now())
  const recoveryCountRef = useRef(0)
  const recoveryWindowStartedAtRef = useRef(Date.now())
  const isSlideIndexAllowedRef = useRef(isSlideIndexAllowed)
  isSlideIndexAllowedRef.current = isSlideIndexAllowed

  const recover = () => {
    const now = Date.now()
    if (now - recoveryWindowStartedAtRef.current > HARD_RELOAD_WINDOW_MS) {
      recoveryWindowStartedAtRef.current = now
      recoveryCountRef.current = 0
    }

    recoveryCountRef.current += 1

    if (recoveryCountRef.current >= MAX_RECOVERIES_BEFORE_HARD_RELOAD) {
      console.error('TVCarouselGuard: muitas falhas seguidas — reload completo.')
      window.location.replace(buildTvHardReloadUrl(window.location.href, 'guard_escalation'))
      return
    }

    carouselRef.current?.recoverToPptFallback()
    lastProgressAtRef.current = Date.now()
  }

  useEffect(() => {
    const resolvedIndex = carouselRef.current?.getActiveIndex() ?? activeIndex
    const report = auditTvCarouselHealth(items, resolvedIndex, isSlideIndexAllowedRef.current)

    if (!report.healthy) {
      recover()
    }
  }, [activeIndex, items])

  useEffect(() => {
    if (lastActiveIndexRef.current !== activeIndex) {
      lastActiveIndexRef.current = activeIndex
      lastProgressAtRef.current = Date.now()
      recoveryCountRef.current = 0
    }
  }, [activeIndex])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const resolvedIndex = carouselRef.current?.getActiveIndex() ?? activeIndex
      const report = auditTvCarouselHealth(items, resolvedIndex, isSlideIndexAllowedRef.current)

      if (!report.healthy) {
        recover()
      }
    }, HEALTH_CHECK_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [activeIndex, items])

  return <>{children}</>
}
