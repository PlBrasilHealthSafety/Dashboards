import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import type { DynamicCarouselItem, DynamicTimerCarouselHandle } from '@/components/custom/DynamicTimerCarousel'
import { auditTvCarouselHealth } from '@/lib/tv-carousel-health'

const HEALTH_CHECK_INTERVAL_MS = 4000
const STALL_RECOVERY_MS = 2500

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

  const recover = (reason: string, reportIssues: string[]) => {
    recoveryCountRef.current += 1
    console.warn('TVCarouselGuard: recuperação automática.', {
      reason,
      activeIndex,
      recoveryCount: recoveryCountRef.current,
      issues: reportIssues,
    })
    carouselRef.current?.recoverToSafeIndex()
    lastProgressAtRef.current = Date.now()
  }

  useEffect(() => {
    const report = auditTvCarouselHealth(items, activeIndex)

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
      const report = auditTvCarouselHealth(items, activeIndex)

      if (!report.healthy) {
        recover('verificação periódica', report.issues)
        return
      }

      const activeItem = items[report.safeIndex]
      const stalledForMs = Date.now() - lastProgressAtRef.current
      const isStalled = stalledForMs >= STALL_RECOVERY_MS && (
        activeItem?.autoSkip ||
        activeItem?.content == null ||
        report.safeIndex !== activeIndex
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
