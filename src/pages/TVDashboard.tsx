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
import { useContratoNotifications } from '@/contexts/ContratoNotificationContext'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getUserRoute } from '@/lib/utils'

export function TVDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { notifications, removeNotification } = useContratoNotifications()
  const [currentNotification, setCurrentNotification] = useState<typeof notifications[0] | null>(null)

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

  // Gerenciar notificações de contratos
  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      // Pegar a notificação mais recente
      const latestNotification = notifications[notifications.length - 1]
      setCurrentNotification(latestNotification)
    }
  }, [notifications, currentNotification])

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

  const handleNotificationComplete = () => {
    if (currentNotification) {
      removeNotification(currentNotification.id)
      setCurrentNotification(null)
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
      {currentNotification && (
        <ContratoNotificationOverlay
          contrato={currentNotification.contrato}
          onComplete={handleNotificationComplete}
        />
      )}
    </div>
  )
}