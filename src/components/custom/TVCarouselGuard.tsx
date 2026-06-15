import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import type { DynamicCarouselItem, DynamicTimerCarouselHandle } from '@/components/custom/DynamicTimerCarousel'
import { auditTvCarouselHealth } from '@/lib/tv-carousel-health'
import { buildTvHardReloadUrl } from '@/lib/tv-session-shield'

const HEALTH_CHECK_INTERVAL_MS = 4000
const STALL_RECOVERY_MS = 1500
const MAX_RECOVERIES_BEFORE_HARD_RELOAD = 3
const HARD_RELOAD_WINDOW_MS = 45000

interface TVCarouselGuardProps {
  items: DynamicCarouselItem[]
  activeIndex: number
  carouselRef: RefObject<DynamicTimerCarouselHandle | null>
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
  children,
}: TVCarouselGuardProps) {
  const lastHealthyAtRef = useRef(Date.now())
  const lastActiveIndexRef = useRef(activeIndex)
  const lastProgressAtRef = useRef(Date.now())
  const recoveryCountRef = useRef(0)
  const recoveryWindowStartedAtRef = useRef(Date.now())

  const recover = (reason: string, reportIssues: string[]) => {
    const now = Date.now()
    if (now - recoveryWindowStartedAtRef.current > HARD_RELOAD_WINDOW_MS) {
      recoveryWindowStartedAtRef.current = now
      recoveryCountRef.current = 0
    }

    recoveryCountRef.current += 1
    console.warn('TVCarouselGuard: recuperação automática.', {
      reason,
      activeIndex,
      recoveryCount: recoveryCountRef.current,
      issues: reportIssues,
    })

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
    const report = auditTvCarouselHealth(items, resolvedIndex)

    if (report.healthy) {
      lastHealthyAtRef.current = Date.now()
      return
    }

    recover('auditoria inicial ou mudança de lista', report.issues)
  }, [activeIndex, items])

  useEffect(() => {
    if (lastActiveIndexRef.current !== activeIndex) {
      lastActiveIndexRef.current = activeIndex
      lastProgressAtRef.current = Date.now()
    }
  }, [activeIndex])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const resolvedIndex = carouselRef.current?.getActiveIndex() ?? activeIndex
      const report = auditTvCarouselHealth(items, resolvedIndex)

      if (!report.healthy) {
        recover('verificação periódica', report.issues)
        return
      }

      const activeItem = items[report.safeIndex]
      const stalledForMs = Date.now() - lastProgressAtRef.current
      const isStalled = stalledForMs >= STALL_RECOVERY_MS && (
        !activeItem ||
        activeItem.autoSkip ||
        activeItem.content == null ||
        report.safeIndex !== resolvedIndex
      )

      if (isStalled) {
        recover(`travamento detectado há ${stalledForMs}ms`, report.issues)
        return
      }

      lastHealthyAtRef.current = Date.now()
    }, HEALTH_CHECK_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [activeIndex, items])

  return <>{children}</>
}
