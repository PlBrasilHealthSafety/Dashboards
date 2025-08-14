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
import { BrandHeroSlideOne, BrandHeroSlideTwo, BrandHeroSlideThree } from '@/components/custom/HeroSlides'
import { DetailedSectorAnalysis } from '@/components/custom/DetailedSectorAnalysis'
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
      { id: 1, content: <BrandHeroSlideOne /> },
      { id: 2, content: <MedicalOverviewSlide /> },
      { id: 3, content: <WeeklyTrendSlide /> },
      { id: 4, content: <BrandHeroSlideTwo /> },
      { id: 5, content: <GoalsVsActualSlide /> },
      { id: 6, content: <IndicatorsSlide /> },
      { id: 7, content: <BrandHeroSlideThree /> },
      { id: 8, content: <AnnualAnalysisSlide /> },
    ]
    return slides
  }, [])

  // Se for perfil de direção, mostra layout executivo completo
  if (role === 'diretoria') {
    return (
      <div className="relative min-h-screen bg-transparent">
        {/* Padrão de fundo sutil PLBrasil para tela toda */}
        <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(0,162,152,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(29,60,68,0.06)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(174,206,203,0.04)_0%,transparent_30%)]"></div>
        
        {/* Seção do slide (carousel) com títulos e espaçamentos */}
        <div className="relative py-6">
          <div className="max-w-7xl mx-auto px-4">
            {/* Título acima do slide - aprimorado e profissional */}
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
                  Centro de Comando Executivo
                </span>
              </h2>
              <p className="text-sm text-slate-600 mt-2 font-medium">
                Painel integrado de indicadores estratégicos • PLBrasil Health & Safety
              </p>
            </div>

            {/* Carousel centralizado em formato wide */}
            <div className="flex justify-center">
              <div className="w-full">
                <div className="w-full rounded-2xl shadow-2xl overflow-hidden bg-white aspect-[16/6]">
                  <Carousel
                    items={carouselItems}
                    className="w-full h-full"
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
            </div>

            {/* Título abaixo do slide */}
            <div className="text-center mt-6 mb-10">
              <h3 className="text-lg font-semibold text-foreground">
                PLBrasil Health & Safety • Panorama de Performance
              </h3>
            </div>
          </div>
        </div>

        {/* Dashboard executivo completo */}
        <ExecutiveLayoutDashboard />

        {/* Seção de análises estilizada */}
        <DetailedSectorAnalysis />
      </div>
    )
  }

  // Para outros perfis, layout mais simples
  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Padrão de fundo sutil PLBrasil para tela toda */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(0,162,152,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(29,60,68,0.06)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(174,206,203,0.04)_0%,transparent_30%)]"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard {role === 'medicina' ? 'Medicina' : 'Comercial'}
          </h1>
          <p className="text-gray-600 mt-2">
            Métricas específicas do setor de {role}
          </p>
        </div>

        {/* Seção do slide (carousel) com títulos e espaçamentos */}
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            {/* Título acima do slide */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Destaques do Setor</h2>
              <p className="text-sm text-muted-foreground">Apresentação resumida de KPIs</p>
            </div>

            {/* Carousel centralizado */}
            <div className="flex justify-center">
              <div className="w-full">
                <div className="w-full rounded-2xl shadow-2xl overflow-hidden bg-white aspect-[16/6]">
                  <Carousel
                    items={carouselItems}
                    className="w-full h-full"
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
            </div>

            {/* Título abaixo do slide */}
            <div className="text-center mt-6 mb-10">
              <h3 className="text-lg font-semibold text-foreground">Análises detalhadas</h3>
            </div>
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