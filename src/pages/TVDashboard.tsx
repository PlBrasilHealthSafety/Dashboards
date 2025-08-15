import { useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Carousel } from '@/components/custom/Carousel'
import { 
  MedicalOverviewSlide, 
  WeeklyTrendSlide, 
  GoalsVsActualSlide, 
  IndicatorsSlide,
  AnnualAnalysisSlide
} from '@/components/custom/MedicalDashboard'
import { BrandHeroSlideOne, BrandHeroSlideTwo, BrandHeroSlideThree } from '@/components/custom/HeroSlides'
import { TVPieChartSlide, TVBarChartSlide, TVGoalsChartSlide } from '@/components/custom/TVChartSlides'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getUserRoute } from '@/lib/utils'

export function TVDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const carouselItems = useMemo(() => {
    // 11 slides: 8 slides de imagens/conteúdo + 3 gráficos limpos
    const slides = [
      { id: 1, content: <BrandHeroSlideOne /> },
      { id: 2, content: <MedicalOverviewSlide /> },
      { id: 3, content: <WeeklyTrendSlide /> },
      { id: 4, content: <BrandHeroSlideTwo /> },
      { id: 5, content: <GoalsVsActualSlide /> },
      { id: 6, content: <IndicatorsSlide /> },
      { id: 7, content: <BrandHeroSlideThree /> },
      { id: 8, content: <AnnualAnalysisSlide /> },
      { id: 9, content: <TVPieChartSlide /> }, // Gráfico 1 - Pizza: Distribuição por Setor
      { id: 10, content: <TVBarChartSlide /> }, // Gráfico 2 - Barras: Performance Mensal
      { id: 11, content: <TVGoalsChartSlide /> }, // Gráfico 3 - Barras: Metas vs Realizado
    ]
    return slides
  }, [])

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
    </div>
  )
}