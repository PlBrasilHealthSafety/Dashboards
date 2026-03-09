import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DynamicTimerCarousel } from '@/components/custom/DynamicTimerCarousel'


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
// import { CampeoesKahootSlide } from '@/components/slides/CampeoesKahootSlide' // Slide desativado temporariamente
import { PodioKahootSlide } from '@/components/slides/PodioKahootSlide'
// import { ComunicadoSlide } from '@/components/slides/ComunicadoSlide' // Slide desativado temporariamente
import { LookerStudioSlide } from '@/components/slides/LookerStudioSlide'
import { ContratoNotificationOverlay } from '@/components/custom/ContratoNotificationOverlay'
import { ImageNotificationOverlay } from '@/components/custom/ImageNotificationOverlay'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getUserRoute } from '@/lib/utils'
import type { Contrato } from '@/lib/types'

export function TVDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentContrato, setCurrentContrato] = useState<(Contrato & { id: string }) | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)

  const carouselItems = useMemo(() => {
    // Ordem: Looker1 → PPT1-3 → Looker2 → PPT4 → Looker3,4 → Aniversário → Pódio → PPT5-8 → Looker5
    const slides = [
      // 1. Convocação (primeiro de tudo)
      { id: 100, content: <LookerStudioSlide url="https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_0uqh1u4wqc" title="Painel de Gestão - Medicina | Convocação" />, duration: 120000 },

      // 2-4. PowerPoint slides 1-3
      { id: 1, content: <PowerPointSlide1 />, duration: 30000 },
      { id: 2, content: <PowerPointSlide2 />, duration: 30000 },
      { id: 3, content: <PowerPointSlide3 />, duration: 30000 },

      // 5. Liberação Dados Gerais (após slide 3)
      { id: 101, content: <LookerStudioSlide url="https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_yh591qsi1d" title="Painel de Gestão - Medicina | Liberação Dados Gerais" />, duration: 120000 },

      // 6. PowerPoint slide 4
      { id: 4, content: <PowerPointSlide4 />, duration: 30000 },

      // 7-8. Agendamento + Desempenho Agendamento (antes do aniversário)
      { id: 102, content: <LookerStudioSlide url="https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_awpgjxuj1d" title="Painel de Gestão - Medicina | Agendamento" />, duration: 120000 },
      { id: 103, content: <LookerStudioSlide url="https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_r7a8jh4j1d" title="Painel de Gestão - Medicina | Desempenho Agendamento" />, duration: 120000 },

      // 9-10. Slides especiais
      { id: 5, content: <AniversariantesSlide />, duration: 180000 },
      { id: 6, content: <PodioKahootSlide />, duration: 180000 },

      // 11-14. PowerPoint slides 5-8
      { id: 8, content: <PowerPointSlide5 />, duration: 30000 },
      { id: 9, content: <PowerPointSlide6 />, duration: 30000 },
      { id: 10, content: <PowerPointSlide7 />, duration: 30000 },
      { id: 11, content: <PowerPointSlide8 />, duration: 30000 },

      // 15. ASOs Dados Gerais (último de tudo)
      { id: 104, content: <LookerStudioSlide url="https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_4mmpny8c0c" title="Painel de Gestão - Medicina | ASOs Dados Gerais" />, duration: 120000 },
    ]
    return slides
  }, [])

  // Listener em tempo real para novos contratos
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupListener = async () => {
      try {
        console.log('TVDashboard: Configurando listener do Firestore...')
        const { collection, onSnapshot } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        // Escutar todos os contratos (simplificado para debug)
        const q = collection(db, 'contratos')

        console.log('TVDashboard: Query configurada, iniciando listener...')

        unsubscribe = onSnapshot(q, (snapshot) => {
          console.log('TVDashboard: Listener ativado, total de documentos:', snapshot.size)

          // Filtrar contratos não exibidos
          const contratosNaoExibidos = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Contrato & { id: string }))
            .filter(contrato => contrato.displayedOnTV === false)
            .sort((a, b) => {
              // Ordenar por createdAt se disponível
              if (a.createdAt && b.createdAt) {
                return b.createdAt.toMillis() - a.createdAt.toMillis()
              }
              return 0
            })

          console.log('TVDashboard: Contratos não exibidos encontrados:', contratosNaoExibidos.length)

          if (contratosNaoExibidos.length > 0 && !currentContrato) {
            const contrato = contratosNaoExibidos[0]
            console.log('TVDashboard: Novo contrato detectado:', contrato)
            setCurrentContrato(contrato)

            // Delay de 1 minuto antes de mostrar o overlay
            setTimeout(() => {
              setShowOverlay(true)
            }, 60000) // 1 minuto
          } else if (contratosNaoExibidos.length === 0) {
            console.log('TVDashboard: Nenhum contrato pendente encontrado')
          } else if (currentContrato) {
            console.log('TVDashboard: Já existe um contrato sendo exibido')
          }
        })
      } catch (error) {
        console.error('Erro ao configurar listener de contratos:', error)
      }
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [currentContrato])

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
  }, [navigate])

  const handleNotificationComplete = async () => {
    if (currentContrato) {
      try {
        // Marcar contrato como exibido na TV
        const { doc, updateDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        await updateDoc(doc(db, 'contratos', currentContrato.id), {
          displayedOnTV: true,
          updatedAt: new Date()
        })

        setCurrentContrato(null)
        setShowOverlay(false)
      } catch (error) {
        console.error('Erro ao marcar contrato como exibido:', error)
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



      {/* Carousel Fullscreen para TV 55 polegadas */}
      <div className="h-screen w-screen">
        <DynamicTimerCarousel
          items={carouselItems}
          className="w-full h-full"
          showNavigation={false}
          showPagination={false}
          showProgressBar={false}
          pauseOnMouseEnter={false}
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