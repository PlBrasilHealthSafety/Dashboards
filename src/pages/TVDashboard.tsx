import { useMemo, useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DynamicTimerCarousel, type DynamicCarouselItem } from '@/components/custom/DynamicTimerCarousel'


import {
  PowerPointSlide1,
  PowerPointSlide2,
  PowerPointSlide3,
  PowerPointSlide4,
  PowerPointSlide5,
  PowerPointSlide6,
  PowerPointSlide7,
  PowerPointSlide8
} from '@/components/custom/PowerPointSlides'
import { AniversariantesSlide } from '@/components/slides/AniversariantesSlide'
import { LookerStudioSlide } from '@/components/slides/LookerStudioSlide'
import { LookerDashboardPreloader } from '@/components/slides/LookerDashboardPreloader'
import { ContratoNotificationOverlay } from '@/components/custom/ContratoNotificationOverlay'
import { ImageNotificationOverlay } from '@/components/custom/ImageNotificationOverlay'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { BIRTHDAY_SLIDE_ID, useBirthdaySlideSchedule } from '@/hooks/useBirthdaySlideSchedule'
import type { BirthdaySlideSlotId } from '@/hooks/useBirthdaySlideSchedule'
import { useLookerSlideSchedule } from '@/hooks/useLookerSlideSchedule'
import { getUserRoute } from '@/lib/utils'
import type { Contrato } from '@/lib/types'
import { isContratoCreatedAfter, isContratoTooOldToDisplay } from '@/lib/tv-contrato-guard'
import {
  getLookerCarouselId,
  getLookerDashboardIdFromCarouselId,
  isLookerCarouselId,
  LOOKER_DASHBOARD_MAP,
  TV_MODE_CAROUSEL_LAYOUT,
} from '@/lib/lookerConfig'

type BrowserTimeoutHandle = number

const CONTRATO_OVERLAY_SHOW_DELAY_MS = 60000
const CONTRATO_LISTENER_BOOTSTRAP_TIMEOUT_MS = 8000
const CONTRATO_OVERLAY_INFO_DURATION_MS = 2 * 60 * 1000
const CONTRATO_OVERLAY_RECOVERY_BUFFER_MS = 60000
const CONTRATO_OVERLAY_LOCK_DURATION_MS =
  CONTRATO_OVERLAY_SHOW_DELAY_MS + CONTRATO_OVERLAY_INFO_DURATION_MS + CONTRATO_OVERLAY_RECOVERY_BUFFER_MS

const readContratoOverlayLockExpiresAt = (value: Contrato['tvOverlayLockExpiresAt']): number | null => {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === 'string') {
    const parsedValue = new Date(value)
    return Number.isNaN(parsedValue.getTime()) ? null : parsedValue.getTime()
  }

  if (typeof value === 'object' && 'toMillis' in value && typeof value.toMillis === 'function') {
    return value.toMillis()
  }

  return null
}

const isContratoOverlayLocked = (contrato: Contrato) => {
  const expiresAt = readContratoOverlayLockExpiresAt(contrato.tvOverlayLockExpiresAt)
  return expiresAt !== null && expiresAt > Date.now()
}

const PPT_SLIDE_COMPONENTS = {
  1: PowerPointSlide1,
  2: PowerPointSlide2,
  3: PowerPointSlide3,
  4: PowerPointSlide4,
  5: PowerPointSlide5,
  6: PowerPointSlide6,
  7: PowerPointSlide7,
  8: PowerPointSlide8,
} as const

export function TVDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentContrato, setCurrentContrato] = useState<(Contrato & { id: string }) | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [isBirthdaySlideActive, setIsBirthdaySlideActive] = useState(false)
  const activeSlideIndexRef = useRef(0)
  const activeBirthdaySlideSlotRef = useRef<BirthdaySlideSlotId | null>(null)
  const currentContratoRef = useRef<(Contrato & { id: string }) | null>(null)
  const overlayDelayTimerRef = useRef<BrowserTimeoutHandle | null>(null)
  const pendingContratoClaimIdRef = useRef<string | null>(null)
  const {
    clockSnapshot,
    isTimeReady,
    currentBirthdaySlideSlot,
    shouldShowBirthdaySlide,
    markBirthdaySlideShown,
  } = useBirthdaySlideSchedule()

  const {
    shouldShowLookerSlides,
    handleLookerSlideEnter,
    handleLookerSlideExit,
  } = useLookerSlideSchedule({ clockSnapshot, isTimeReady })

  const clearOverlayDelayTimer = useCallback(() => {
    if (overlayDelayTimerRef.current) {
      window.clearTimeout(overlayDelayTimerRef.current)
      overlayDelayTimerRef.current = null
    }
  }, [])

  const markContratoAsDisplayed = useCallback(async (contratoId: string) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')

      await updateDoc(doc(db, 'contratos', contratoId), {
        displayedOnTV: true,
        tvOverlayLockExpiresAt: null,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('TVDashboard: Erro ao marcar contrato como exibido no inicio do overlay:', error)
    }
  }, [])

  const dismissContratoFromTVQueue = useCallback(async (contratoId: string, reason: string) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')

      await updateDoc(doc(db, 'contratos', contratoId), {
        displayedOnTV: true,
        tvOverlayLockExpiresAt: null,
        updatedAt: new Date()
      })

      console.log(`TVDashboard: Contrato ${contratoId} removido da fila da TV (${reason})`)
    } catch (error) {
      console.error(`TVDashboard: Erro ao remover contrato ${contratoId} da fila da TV:`, error)
    }
  }, [])

  const claimContratoOverlay = useCallback(async (contratoId: string) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('@/lib/firebase')

      await updateDoc(doc(db, 'contratos', contratoId), {
        displayedOnTV: true,
        tvOverlayLockExpiresAt: new Date(Date.now() + CONTRATO_OVERLAY_LOCK_DURATION_MS),
        updatedAt: new Date()
      })

      return true
    } catch (error) {
      console.error('TVDashboard: Erro ao registrar lock persistido do overlay de contrato:', error)
      return false
    }
  }, [])

  const carouselItems = useMemo((): DynamicCarouselItem[] => {
    return TV_MODE_CAROUSEL_LAYOUT.flatMap((entry): DynamicCarouselItem[] => {
      if (entry.kind === 'ppt') {
        const SlideComponent = PPT_SLIDE_COMPONENTS[entry.slide]
        return [{
          id: entry.slide,
          content: <SlideComponent />,
          duration: 30000,
        }]
      }

      if (entry.kind === 'birthday') {
        if (!shouldShowBirthdaySlide && !isBirthdaySlideActive) {
          return []
        }

        return [{
          id: BIRTHDAY_SLIDE_ID,
          content: <AniversariantesSlide />,
          duration: 180000,
        }]
      }

      const dashboard = LOOKER_DASHBOARD_MAP[entry.dashboardId]
      if (!dashboard || !shouldShowLookerSlides) {
        return []
      }

      return [{
        id: getLookerCarouselId(entry.dashboardId),
        content: (
          <LookerStudioSlide
            url={dashboard.url}
            title={dashboard.title}
            refreshInterval={0}
          />
        ),
        duration: dashboard.duration,
      }]
    })
  }, [isBirthdaySlideActive, shouldShowBirthdaySlide, shouldShowLookerSlides])

  const handleSlideChange = useCallback((nextIndex: number) => {
    const previousItem = carouselItems[activeSlideIndexRef.current]
    const nextItem = carouselItems[nextIndex]

    if (previousItem && isLookerCarouselId(previousItem.id)) {
      handleLookerSlideExit(getLookerDashboardIdFromCarouselId(previousItem.id))
    }

    if (previousItem?.id === BIRTHDAY_SLIDE_ID) {
      setIsBirthdaySlideActive(false)
      markBirthdaySlideShown({ slotId: activeBirthdaySlideSlotRef.current })
      activeBirthdaySlideSlotRef.current = null
    }

    if (nextItem && isLookerCarouselId(nextItem.id)) {
      handleLookerSlideEnter(getLookerDashboardIdFromCarouselId(nextItem.id))
    }

    if (nextItem?.id === BIRTHDAY_SLIDE_ID) {
      activeBirthdaySlideSlotRef.current = currentBirthdaySlideSlot
      setIsBirthdaySlideActive(true)
      markBirthdaySlideShown({ slotId: currentBirthdaySlideSlot, updateState: false })
    }

    activeSlideIndexRef.current = nextIndex
  }, [carouselItems, currentBirthdaySlideSlot, handleLookerSlideEnter, handleLookerSlideExit, markBirthdaySlideShown])

  useEffect(() => {
    currentContratoRef.current = currentContrato
  }, [currentContrato])

  useEffect(() => {
    if (activeSlideIndexRef.current >= carouselItems.length) {
      activeSlideIndexRef.current = 0
    }
  }, [carouselItems.length])

  useEffect(() => {
    return () => {
      pendingContratoClaimIdRef.current = null
      clearOverlayDelayTimer()
    }
  }, [clearOverlayDelayTimer])

  // Listener em tempo real para novos contratos
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let bootstrapTimeoutId: BrowserTimeoutHandle | undefined
    const knownContratoIds = new Set<string>()
    let listenerBootstrapComplete = false
    let listenerSessionStartedAtMs = Date.now()

    const completeListenerBootstrap = (reason: string) => {
      if (listenerBootstrapComplete) {
        return
      }

      listenerBootstrapComplete = true
      listenerSessionStartedAtMs = Date.now()
      if (bootstrapTimeoutId) {
        window.clearTimeout(bootstrapTimeoutId)
        bootstrapTimeoutId = undefined
      }

      console.log(
        `TVDashboard: Sincronização inicial concluída (${reason}). Contratos pendentes ignorados:`,
        knownContratoIds.size
      )
    }

    const registerKnownContratos = (contratos: Array<Contrato & { id: string }>) => {
      for (const contrato of contratos) {
        knownContratoIds.add(contrato.id)
      }
    }

    const setupListener = async () => {
      try {
        console.log('TVDashboard: Configurando listener do Firestore...')
        const { collection, onSnapshot, query, where } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        const q = query(
          collection(db, 'contratos'),
          where('displayedOnTV', '==', false)
        )

        bootstrapTimeoutId = window.setTimeout(() => {
          completeListenerBootstrap('timeout de segurança')
        }, CONTRATO_LISTENER_BOOTSTRAP_TIMEOUT_MS)

        console.log('TVDashboard: Query configurada, iniciando listener...')

        unsubscribe = onSnapshot(q, (snapshot) => {
          const pendingContratos = snapshot.docs.map(
            doc => ({ id: doc.id, ...doc.data() } as Contrato & { id: string })
          )

          console.log(
            'TVDashboard: Listener ativado, contratos pendentes na query:',
            snapshot.size,
            snapshot.metadata.fromCache ? '(cache)' : '(servidor)'
          )

          if (!listenerBootstrapComplete) {
            registerKnownContratos(pendingContratos)

            for (const contrato of pendingContratos) {
              if (isContratoTooOldToDisplay(contrato)) {
                void dismissContratoFromTVQueue(contrato.id, 'contrato obsoleto na sincronização inicial')
              }
            }

            if (!snapshot.metadata.fromCache) {
              completeListenerBootstrap('snapshot do servidor')
            }

            return
          }

          const contratosAdicionados = snapshot.docChanges()
            .filter(change => change.type === 'added')
            .map(change => ({ id: change.doc.id, ...change.doc.data() } as Contrato & { id: string }))
            .filter(contrato => !knownContratoIds.has(contrato.id))
            .filter(contrato => isContratoCreatedAfter(contrato, listenerSessionStartedAtMs))
            .filter(contrato => !isContratoOverlayLocked(contrato))
            .filter(contrato => !isContratoTooOldToDisplay(contrato))
            .sort((a, b) => {
              if (a.createdAt && b.createdAt) {
                return b.createdAt.toMillis() - a.createdAt.toMillis()
              }
              return 0
            })

          registerKnownContratos(contratosAdicionados)

          console.log('TVDashboard: Novos contratos adicionados após a TV abrir:', contratosAdicionados.length)

          if (contratosAdicionados.length > 0 && !currentContratoRef.current && !pendingContratoClaimIdRef.current) {
            const contrato = contratosAdicionados[0]
            console.log('TVDashboard: Novo contrato detectado:', contrato)
            pendingContratoClaimIdRef.current = contrato.id

            void (async () => {
              const claimSucceeded = await claimContratoOverlay(contrato.id)
              pendingContratoClaimIdRef.current = null

              if (!claimSucceeded || currentContratoRef.current) {
                return
              }

              currentContratoRef.current = contrato
              setCurrentContrato(contrato)

              // Delay de 1 minuto antes de mostrar o overlay
              clearOverlayDelayTimer()
              overlayDelayTimerRef.current = window.setTimeout(() => {
                void markContratoAsDisplayed(contrato.id)
                setShowOverlay(true)
              }, CONTRATO_OVERLAY_SHOW_DELAY_MS)
            })()
          } else if (contratosAdicionados.length === 0) {
            console.log('TVDashboard: Nenhum contrato novo detectado nesta atualização')
          } else if (currentContratoRef.current) {
            console.log('TVDashboard: Já existe um contrato sendo exibido')
          }
        })
      } catch (error) {
        console.error('Erro ao configurar listener de contratos:', error)
      }
    }

    setupListener()

    return () => {
      pendingContratoClaimIdRef.current = null
      clearOverlayDelayTimer()
      if (bootstrapTimeoutId) {
        window.clearTimeout(bootstrapTimeoutId)
      }
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [claimContratoOverlay, clearOverlayDelayTimer, dismissContratoFromTVQueue, markContratoAsDisplayed])

  // Listener para tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const userRoute = getUserRoute(user?.email || null)
        navigate(userRoute)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate, user?.email])

  const handleNotificationComplete = async () => {
    if (currentContrato) {
      clearOverlayDelayTimer()

      try {
        // Marcar contrato como exibido na TV
        const { doc, updateDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        await updateDoc(doc(db, 'contratos', currentContrato.id), {
          displayedOnTV: true,
          tvOverlayLockExpiresAt: null,
          updatedAt: new Date()
        })

        currentContratoRef.current = null
        setCurrentContrato(null)
        setShowOverlay(false)
      } catch (error) {
        console.error('Erro ao marcar contrato como exibido:', error)
        currentContratoRef.current = null
        setCurrentContrato(null)
        setShowOverlay(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Botão flutuante discreto para voltar */}
      <button
        onClick={() => {
          const userRoute = getUserRoute(user?.email || null)
          navigate(userRoute)
        }}
        className="fixed top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white rounded-full p-3 opacity-70 hover:opacity-100 transition-all duration-300 group"
        title="Pressione ESC ou clique para voltar ao dashboard"
      >
        <X className="w-5 h-5" />
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          ESC ou clique para voltar
        </div>
      </button>



      <LookerDashboardPreloader />

      {/* Carousel Fullscreen para TV 55 polegadas */}
      <div className="h-screen w-screen">
        <DynamicTimerCarousel
          items={carouselItems}
          className="w-full h-full"
          showNavigation={false}
          showPagination={false}
          showProgressBar={false}
          pauseOnMouseEnter={false}
          preloadAhead={8}
          onSlideChange={handleSlideChange}
        />
      </div>

      {/* Overlay de notificação de contrato */}
      {currentContrato && showOverlay && (
        <ContratoNotificationOverlay
          contrato={{
            razaoSocial: currentContrato.razaoSocial,
            nomeFantasia: currentContrato.nomeFantasia,
            dataInicioContrato: currentContrato.dataInicioContrato,
            userId: currentContrato.userId
          }}
          onComplete={handleNotificationComplete}
        />
      )}

      {/* Overlay de imagem fixa */}
      <ImageNotificationOverlay />
    </div>
  )
}