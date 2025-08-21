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
import { DetailedSectorAnalysis } from '@/components/custom/DetailedSectorAnalysis'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Dados para o gráfico de evolução trimestral
const evolucaoTrimestralData = [
  { trimestre: 'T1', Administrativo: 2.8, Comercial: 3.2, Medicina: 3.8, Operacoes: 3.1 },
  { trimestre: 'T2', Administrativo: 3.1, Comercial: 3.5, Medicina: 4.1, Operacoes: 3.3 },
  { trimestre: 'T3', Administrativo: 3.4, Comercial: 3.8, Medicina: 4.4, Operacoes: 3.6 },
  { trimestre: 'T4', Administrativo: 3.7, Comercial: 4.1, Medicina: 4.7, Operacoes: 3.9 }
]

export function DirecaoPage() {

  const carouselItems = useMemo(() => {
    // 11 slides: 8 slides de PowerPoint + 3 gráficos específicos
    const slides = [
      { id: 1, content: <PowerPointSlide1 /> },
      { id: 2, content: <PowerPointSlide2 /> },
      { id: 3, content: <PowerPointSlide3 /> },
      { id: 4, content: <PowerPointSlide4 /> },
      { id: 5, content: <PowerPointSlide5 /> },
      { id: 6, content: <PowerPointSlide6 /> },
      { id: 7, content: <PowerPointSlide7 /> },
      { id: 8, content: <PowerPointSlide8 /> },
      { id: 9, content: <GoalsVsActualSlide /> }, // Gráfico de setores
      { id: 10, content: <WeeklyTrendSlide /> }, // Gráfico de barras
      { id: 11, content: <IndicatorsSlide /> }, // Dashboard de métricas
    ]
    return slides
  }, [])

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Padrão de fundo sutil PLBrasil para tela toda */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(0,162,152,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(29,60,68,0.06)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(174,206,203,0.04)_0%,transparent_30%)]"></div>
      
      {/* Seção do slide (carousel) com títulos e espaçamentos */}
      <div className="relative py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Título acima do slide - aprimorado e profissional */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
                Dashboard Interativo de Sistema
              </span>
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-medium">
              Painel integrado de indicadores estratégicos • PLBrasil Health & Safety
            </p>
          </div>

          {/* Carousel centralizado em formato wide */}
          <div className="flex justify-center mt-12">
            <div className="w-full">
              <div className="w-full rounded-2xl shadow-2xl overflow-hidden bg-white aspect-[16/8]">
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

      {/* Gráfico grande de evolução trimestral */}
      <div className="mx-8 mb-12">
        <div className="bg-white rounded-xl p-8 shadow-lg border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <h2 className="text-2xl font-bold text-slate-800">Evolução Trimestral por Setor</h2>
          </div>
          <p className="text-slate-600 mb-8 text-lg">Receita normalizada de todos os setores ao longo do ano</p>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoTrimestralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="trimestre" 
                  stroke="#64748b" 
                  fontSize={14}
                  fontWeight={500}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={14}
                  fontWeight={500}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Administrativo" 
                  stroke="#8B8B8B" 
                  strokeWidth={4}
                  dot={{ fill: '#8B8B8B', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Comercial" 
                  stroke="#1D3C44" 
                  strokeWidth={4}
                  dot={{ fill: '#1D3C44', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Medicina" 
                  stroke="#00A298" 
                  strokeWidth={4}
                  dot={{ fill: '#00A298', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Operacoes" 
                  stroke="#3B82F6" 
                  strokeWidth={4}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}