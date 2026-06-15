import { useEffect, useRef, type RefObject } from 'react'
import type { DynamicCarouselItem, DynamicTimerCarouselHandle } from '@/components/custom/DynamicTimerCarousel'
import { isRenderableCarouselItem } from '@/lib/carousel-pointer'
import { isSlideStalled, shouldRunNightlyTvReload } from '@/lib/tv-kiosk-shield'
import { buildTvHardReloadUrl } from '@/lib/tv-session-shield'

const KIOSK_CHECK_INTERVAL_MS = 10000
const NIGHTLY_RELOAD_STORAGE_KEY = 'plbrasil:tv-nightly-reload-date'

interface UseTvKioskShieldOptions {
  activeIndex: number
  items: DynamicCarouselItem[]
  carouselRef?: RefObject<DynamicTimerCarouselHandle | null>
  /** Pausar vigilancia durante overlay de contrato, etc. */
  isPlaybackPaused?: boolean
}

const hardReloadTv = (reason: string) => {
  console.warn('TVDashboard: reload por trava kiosk.', { reason })
  window.location.replace(buildTvHardReloadUrl(window.location.href, reason))
}

export function useTvKioskShield({
  activeIndex,
  items,
  carouselRef,
  isPlaybackPaused = false,
}: UseTvKioskShieldOptions) {
  const activeIndexRef = useRef(activeIndex)
  const itemsRef = useRef(items)
  const lastSlideChangeAtRef = useRef(Date.now())
  const reloadScheduledRef = useRef(false)

  activeIndexRef.current = activeIndex
  itemsRef.current = items

  useEffect(() => {
    lastSlideChangeAtRef.current = Date.now()
  }, [activeIndex])

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      console.error('TVDashboard: erro global capturado.', event.error ?? event.message)
      hardReloadTv('global_error')
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('TVDashboard: promise rejeitada sem tratamento.', event.reason)
      hardReloadTv('unhandled_rejection')
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandledRejection)

    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandledRejection)
    }
  }, [])

  useEffect(() => {
    const onOffline = () => {
      console.warn('TVDashboard: conexao perdida.')
    }

    const onOnline = () => {
      console.info('TVDashboard: conexao restabelecida — recarregando.')
      hardReloadTv('network_online')
    }

    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)

    return () => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null

    const requestWakeLock = async () => {
      if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') {
        return
      }

      try {
        wakeLock = await navigator.wakeLock.request('screen')
      } catch (error) {
        console.warn('TVDashboard: wake lock indisponivel.', error)
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void requestWakeLock()
      }
    }

    void requestWakeLock()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      void wakeLock?.release()
    }
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (isPlaybackPaused || reloadScheduledRef.current) {
        return
      }

      const currentItems = itemsRef.current
      const currentIndex = carouselRef?.current?.getActiveIndex() ?? activeIndexRef.current
      const activeItem = currentItems[currentIndex]
      const stalledForMs = Date.now() - lastSlideChangeAtRef.current

      if (!isRenderableCarouselItem(activeItem)) {
        carouselRef?.current?.recoverToSafeIndex()
        lastSlideChangeAtRef.current = Date.now()
        return
      }

      if (isSlideStalled(stalledForMs, activeItem)) {
        reloadScheduledRef.current = true
        hardReloadTv('slide_stall')
      }
    }, KIOSK_CHECK_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [carouselRef, isPlaybackPaused])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      let lastReloadDateKey: string | null = null
      try {
        lastReloadDateKey = localStorage.getItem(NIGHTLY_RELOAD_STORAGE_KEY)
      } catch {
        lastReloadDateKey = null
      }

      const nightly = shouldRunNightlyTvReload(new Date(), lastReloadDateKey)
      if (!nightly.shouldReload || reloadScheduledRef.current) {
        return
      }

      try {
        localStorage.setItem(NIGHTLY_RELOAD_STORAGE_KEY, nightly.dateKey)
      } catch {
        // ignora
      }

      reloadScheduledRef.current = true
      hardReloadTv('nightly_maintenance')
    }, 60000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])
}
