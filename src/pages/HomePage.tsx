import { useMemo } from 'react'
import { Carousel } from '@/components/custom/Carousel'
import { ExecutiveLayoutDashboard } from '@/components/custom/ExecutiveLayoutDashboard'
import { 
  MedicalOverviewSlide, 
  WeeklyTrendSlide, 
  GoalsVsActualSlide, 
  IndicatorsSlide,
  AnnualAnalysisSlide
} from '@/components/custom/MedicalDashboard'
import { useAuth } from '@/hooks/useAuth'
import { useDocument } from '@/hooks/useFirestore'

type Role = 'diretoria' | 'medicina' | 'comercial'

export function HomePage() {
  const { user } = useAuth()
  const { data: profile } = useDocument<{ role: Role }>('users', user?.uid ?? null)

  const role: Role = profile?.role || 'diretoria'

  const carouselItems = useMemo(() => {
    // 8 slides diferentes, cada um com 30 segundos
    const slides = [
      { id: 1, content: <MedicalOverviewSlide /> },
      { id: 2, content: <WeeklyTrendSlide /> },
      { id: 3, content: <GoalsVsActualSlide /> },
      { id: 4, content: <IndicatorsSlide /> },
      { id: 5, content: <AnnualAnalysisSlide /> },
      { id: 6, content: <MedicalOverviewSlide /> },
      { id: 7, content: <WeeklyTrendSlide /> },
      { id: 8, content: <GoalsVsActualSlide /> },
    ]
    return slides
  }, [])

  // Se for perfil de direção, mostra layout executivo completo
  if (role === 'diretoria') {
    return (
      <div className="relative">
        {/* Carousel centralizado no topo */}
        <div className="flex justify-center p-6">
          <div className="w-full max-w-5xl">
            <Carousel
              items={carouselItems}
              className="rounded-2xl shadow-2xl overflow-hidden"
              slidesPerView={1}
              spaceBetween={0}
              loop
              centeredSlides
              showNavigation
              showPagination
              autoplay={{ 
                delay: 30000, // 30 segundos por slide
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
            />
          </div>
        </div>

        {/* Dashboard executivo completo */}
        <ExecutiveLayoutDashboard />
      </div>
    )
  }

  // Para outros perfis, layout mais simples
  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard {role === 'medicina' ? 'Medicina' : 'Comercial'}
          </h1>
          <p className="text-gray-600 mt-2">
            Métricas específicas do setor de {role}
          </p>
        </div>

        {/* Carousel centralizado */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-5xl">
            <Carousel
              items={carouselItems}
              className="rounded-2xl shadow-2xl overflow-hidden"
              slidesPerView={1}
              spaceBetween={0}
              loop
              centeredSlides
              showNavigation
              showPagination
              autoplay={{ 
                delay: 30000, // 30 segundos por slide
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
            />
          </div>
        </div>

        {/* Dashboard específico do setor */}
        <div className="max-w-7xl mx-auto">
          {role === 'medicina' ? (
            <MedicalOverviewSlide />
          ) : (
            <GoalsVsActualSlide />
          )}
        </div>
      </div>
    </div>
  )
}