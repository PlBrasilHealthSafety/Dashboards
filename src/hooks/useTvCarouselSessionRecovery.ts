import { useCallback, useEffect, useRef, type RefObject } from 'react'
import type { DynamicCarouselItem, DynamicTimerCarouselHandle } from '@/components/custom/DynamicTimerCarousel'
import { auditTvCarouselHealth } from '@/lib/tv-carousel-health'
import { getTvStationId, hasExplicitTvStationParam } from '@/lib/tv-station'
import {
  buildTvHardReloadUrl,
  isDuplicateTvSessionMessage,
  isTvDashboardPath,
  shouldReloadDiscardedTvTab,
  TV_SESSION_BROADCAST_CHANNEL,
  type TvSessionPeerMessage,
} from '@/lib/tv-session-shield'

const HEALTH_RELOAD_ESCALATION_MS = 800
const DUPLICATE_TAB_RELOAD_DELAY_MS = 150
const TV_TAB_ID_STORAGE_KEY = 'plbrasil:tv-tab-id'

interface UseTvCarouselSessionRecoveryOptions {
  carouselRef: RefObject<DynamicTimerCarouselHandle | null>
  items: DynamicCarouselItem[]
  activeIndex: number
  isSlideIndexAllowed?: (slideIndex: number) => boolean
}

const readOrCreateTabId = (): string => {
  try {
    const existing = sessionStorage.getItem(TV_TAB_ID_STORAGE_KEY)
    if (existing) {
      return existing
    }

    const created =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `tab-${Date.now()}`

    sessionStorage.setItem(TV_TAB_ID_STORAGE_KEY, created)
    return created
  } catch {
    return `tab-${Date.now()}`
  }
}

/**
 * Proteção máxima contra "continuar sessão" / bfcache / abas duplicadas na mesma estação TV.
 */
export function useTvCarouselSessionRecovery({
  carouselRef,
  items,
  activeIndex,
  isSlideIndexAllowed,
}: UseTvCarouselSessionRecoveryOptions) {
  const itemsRef = useRef(items)
  const activeIndexRef = useRef(activeIndex)
  const hardReloadScheduledRef = useRef(false)
  const isSlideIndexAllowedRef = useRef(isSlideIndexAllowed)
  isSlideIndexAllowedRef.current = isSlideIndexAllowed

  itemsRef.current = items
  activeIndexRef.current = activeIndex

  const hardReload = useCallback((reason: string) => {
    if (hardReloadScheduledRef.current) {
      return
    }

    hardReloadScheduledRef.current = true
    console.warn('TVDashboard: reload completo da TV.', { reason })

    window.location.replace(buildTvHardReloadUrl(window.location.href, reason))
  }, [])

  const tryRecover = useCallback((reason: string, options?: { escalateToReload?: boolean }) => {
    const resolvedIndex = carouselRef.current?.getActiveIndex() ?? activeIndexRef.current
    const report = auditTvCarouselHealth(
      itemsRef.current,
      resolvedIndex,
      isSlideIndexAllowedRef.current,
    )

    if (!report.healthy) {
      console.warn('TVDashboard: recuperando sessao da TV.', {
        reason,
        activeIndex: resolvedIndex,
        safeIndex: report.safeIndex,
        issues: report.issues,
      })
      carouselRef.current?.recoverToPptFallback()
    }

    if (options?.escalateToReload) {
      window.setTimeout(() => {
        const followUpIndex = carouselRef.current?.getActiveIndex() ?? activeIndexRef.current
        const followUp = auditTvCarouselHealth(
          itemsRef.current,
          followUpIndex,
          isSlideIndexAllowedRef.current,
        )
        if (!followUp.healthy) {
          hardReload(reason)
        }
      }, HEALTH_RELOAD_ESCALATION_MS)
    }
  }, [carouselRef, hardReload])

  useEffect(() => {
    if (!isTvDashboardPath(window.location.pathname)) {
      return
    }

    const wasDiscarded = 'wasDiscarded' in document && Boolean((document as Document & { wasDiscarded?: boolean }).wasDiscarded)
    if (shouldReloadDiscardedTvTab(wasDiscarded, window.location.pathname)) {
      hardReload('tab_discarded')
      return
    }

    const tabId = readOrCreateTabId()
    const stationId = getTvStationId()
    const multiTvMode = hasExplicitTvStationParam()
    let broadcastChannel: BroadcastChannel | null = null

    if (multiTvMode) {
      try {
        broadcastChannel = new BroadcastChannel(TV_SESSION_BROADCAST_CHANNEL)
      } catch {
        broadcastChannel = null
      }
    }

    const announcePresence = (type: TvSessionPeerMessage['type']) => {
      broadcastChannel?.postMessage({
        type,
        stationId,
        tabId,
        at: Date.now(),
      } satisfies TvSessionPeerMessage)
    }

    const onPeerMessage = (event: MessageEvent<TvSessionPeerMessage>) => {
      if (!multiTvMode) {
        return
      }

      if (!event.data || !isDuplicateTvSessionMessage(event.data, stationId, tabId)) {
        return
      }

      console.warn('TVDashboard: outra aba detectada na mesma estacao TV.', {
        stationId,
        localTabId: tabId,
        remoteTabId: event.data.tabId,
      })

      window.setTimeout(() => {
        hardReload('duplicate_tab')
      }, DUPLICATE_TAB_RELOAD_DELAY_MS)
    }

    let peerHeartbeatId: number | undefined

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', onPeerMessage)
      announcePresence('hello')

      peerHeartbeatId = window.setInterval(() => {
        announcePresence('ping')
      }, 5000)
    }

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        hardReload('pageshow_bfcache')
        return
      }

      tryRecover('pagina exibida')
    }

    const onPageResume = () => {
      hardReload('page_resume')
    }

    const onFreeze = () => {
      console.info('TVDashboard: pagina congelada pelo navegador (bfcache).')
    }

    const onStorage = (event: StorageEvent) => {
      if (!event.key?.startsWith('plbrasil:')) {
        return
      }

      tryRecover(`outra aba/TV alterou armazenamento (${event.key})`, { escalateToReload: true })
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        tryRecover('TV voltou a ficar visivel', { escalateToReload: true })
      }
    }

    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('resume', onPageResume)
    document.addEventListener('freeze', onFreeze)
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVisibility)

    tryRecover('inicializacao')

    return () => {
      if (peerHeartbeatId !== undefined) {
        window.clearInterval(peerHeartbeatId)
      }
      broadcastChannel?.removeEventListener('message', onPeerMessage)
      broadcastChannel?.close()
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('resume', onPageResume)
      document.removeEventListener('freeze', onFreeze)
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [hardReload, tryRecover])
}
