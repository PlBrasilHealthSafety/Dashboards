import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Carousel } from '@/components/custom/Carousel'

import { TVPieChartSlide, TVBarChartSlide, TVGoalsChartSlide } from '@/components/custom/TVChartSlides'
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
import { ContratoNotificationOverlay } from '@/components/custom/ContratoNotificationOverlay'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getUserRoute } from '@/lib/utils'
import type { Contrato } from '@/lib/types'

export function TVDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentContrato, setCurrentContrato] = useState<(Contrato & { id: string }) | null>(null)

  const carouselItems = useMemo(() => {
    // 11 slides: 8 slides de PowerPoint + 3 gráficos limpos
    const slides = [
      { id: 1, content: <PowerPointSlide1 /> },
      { id: 2, content: <PowerPointSlide2 /> },
      { id: 3, content: <PowerPointSlide3 /> },
      { id: 4, content: <PowerPointSlide4 /> },
      { id: 5, content: <PowerPointSlide5 /> },
      { id: 6, content: <PowerPointSlide6 /> },
      { id: 7, content: <PowerPointSlide7 /> },
      { id: 8, content: <PowerPointSlide8 /> },
      { id: 9, content: <TVPieChartSlide /> }, // Gráfico 1 - Pizza: Distribuição por Setor
      { id: 10, content: <TVBarChartSlide /> }, // Gráfico 2 - Barras: Performance Mensal
      { id: 11, content: <TVGoalsChartSlide /> }, // Gráfico 3 - Barras: Metas vs Realizado
    ]
    return slides
  }, [])

  // Listener em tempo real para novos contratos
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupListener = async () => {
      try {
        const { collection, query, where, orderBy, onSnapshot, limit } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        // Escutar contratos que ainda não foram exibidos na TV
        const q = query(
          collection(db, 'contratos'),
          where('displayedOnTV', '==', false),
          orderBy('createdAt', 'desc'),
          limit(1)
        )

        unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty && !currentContrato) {
            const doc = snapshot.docs[0]
            const contrato = { id: doc.id, ...doc.data() } as Contrato & { id: string }
            setCurrentContrato(contrato)
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
      } catch (error) {
        console.error('Erro ao marcar contrato como exibido:', error)
        setCurrentContrato(null)
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
        <Carousel
          items={carouselItems}
          className="w-full h-full"
          slidesPerView={1}
          spaceBetween={0}
          loop
          centeredSlides
          showNavigation={false}
          showPagination={false}
          autoplay={{ 
            delay: 30000, // 30 segundos por slide
            disableOnInteraction: false,
            pauseOnMouseEnter: false
          }}
        />
      </div>

      {/* Overlay de notificação de contrato */}
      {currentContrato && (
        <ContratoNotificationOverlay
          contrato={{
            titulo: currentContrato.titulo,
            descricao: currentContrato.descricao,
            userId: currentContrato.userId
          }}
          onComplete={handleNotificationComplete}
        />
      )}
    </div>
  )
}