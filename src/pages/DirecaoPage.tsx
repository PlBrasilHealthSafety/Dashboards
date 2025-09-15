import { useMemo } from 'react'
import { DynamicTimerCarousel } from '@/components/custom/DynamicTimerCarousel'
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button'
import { ExecutiveLayoutDashboard } from '@/components/custom/ExecutiveLayoutDashboard'


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
import { CampeoesKahootSlide } from '@/components/slides/CampeoesKahootSlide'
import { ComunicadoSlide } from '@/components/slides/ComunicadoSlide'
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
    // 8 slides de PowerPoint + slide de aniversariantes + slide de campeões Kahoot + comunicado
    const slides = [
      { id: 1, content: <PowerPointSlide1 />, duration: 30000 }, // 30 seconds
      { id: 2, content: <PowerPointSlide2 />, duration: 30000 }, // 30 seconds
      { id: 3, content: <PowerPointSlide3 />, duration: 30000 }, // 30 seconds
      { id: 4, content: <PowerPointSlide4 />, duration: 30000 }, // 30 seconds
      { id: 5, content: <AniversariantesSlide />, duration: 180000 }, // 3 minutes (180 seconds)
      { id: 6, content: <CampeoesKahootSlide />, duration: 120000 }, // 2 minutes (120 seconds)
      { id: 7, content: <ComunicadoSlide />, duration: 180000 }, // 3 minutes (180 seconds)
      { id: 8, content: <PowerPointSlide5 />, duration: 30000 }, // 30 seconds
      { id: 9, content: <PowerPointSlide6 />, duration: 30000 }, // 30 seconds
      { id: 10, content: <PowerPointSlide7 />, duration: 30000 }, // 30 seconds
      { id: 11, content: <PowerPointSlide8 />, duration: 30000 }, // 30 seconds
    ]
    return slides
  }, [])

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Padrão de fundo sutil PLBrasil para tela toda */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(0,162,152,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(29,60,68,0.06)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(174,206,203,0.04)_0%,transparent_30%)]"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
            Dashboard Diretoria
          </h1>
          <p className="text-[#1D3C44]/80 mt-2">
            Visão estratégica e indicadores executivos
          </p>
        </div>

        {/* Seção do slide (carousel) com títulos e espaçamentos */}
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4">

            {/* Carousel centralizado */}
            <div className="flex justify-center">
            <div className="w-full">
              <div className="w-full rounded-2xl shadow-2xl overflow-hidden bg-white aspect-[20/9]">
                <DynamicTimerCarousel
                  items={carouselItems}
                  className="w-full h-full"
                  showNavigation
                  showPagination
                  pauseOnMouseEnter={false}
                />
              </div>
            </div>
          </div>

          </div>
        </div>

        {/* Título abaixo do slide */}
        <div className="text-center mt-10 mb-16">
          <h3 className="text-xl font-bold tracking-tight text-center bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
            Análises detalhadas
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] mx-auto mt-3 rounded-full"></div>
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
      
      <ScrollToTopButton />
    </div>
  )
}