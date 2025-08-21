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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type Role = 'diretoria' | 'medicina' | 'comercial'

// Dados para o gráfico de evolução trimestral
const evolucaoTrimestralData = [
  { trimestre: 'T1', Administrativo: 2.8, Comercial: 3.2, Medicina: 3.8, Operacoes: 3.1 },
  { trimestre: 'T2', Administrativo: 3.1, Comercial: 3.5, Medicina: 4.1, Operacoes: 3.3 },
  { trimestre: 'T3', Administrativo: 3.4, Comercial: 3.8, Medicina: 4.4, Operacoes: 3.6 },
  { trimestre: 'T4', Administrativo: 3.7, Comercial: 4.1, Medicina: 4.7, Operacoes: 3.9 }
]

export function HomePage() {
  const { user } = useAuth()
  const { data: profile } = useDocument<{ role: Role }>('users', user?.uid ?? null)

  // Detecta perfil pelo email ou pelo role do Firestore
  const isMedicinaUser = user?.email?.includes('medicina') || profile?.role === 'medicina'
  const isComercialUser = user?.email?.includes('comercial') || profile?.role === 'comercial'

  const role: Role = isMedicinaUser ? 'medicina' :
    isComercialUser ? 'comercial' :
      (profile?.role || 'diretoria')

  const carouselItems = useMemo(() => {
    // Slides sempre iguais para todos os usuários
    const slides = [
      { id: 1, content: <BrandHeroSlideOne /> },
      { id: 2, content: <MedicalOverviewSlide /> },
      { id: 3, content: <WeeklyTrendSlide /> },
      { id: 4, content: <BrandHeroSlideTwo /> },
      { id: 5, content: <GoalsVsActualSlide /> },
      { id: 6, content: <IndicatorsSlide /> },
      { id: 7, content: <BrandHeroSlideThree /> },
      { id: 8, content: <AnnualAnalysisSlide /> },
      { id: 9, content: <GoalsVsActualSlide /> }, // Gráfico de setores
      { id: 10, content: <WeeklyTrendSlide /> }, // Gráfico de barras
      { id: 11, content: <IndicatorsSlide /> }, // Dashboard de métricas
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

        {/* Gráfico grande de evolução trimestral - só para diretoria */}
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

          </div>
        </div>

        {/* Título abaixo do slide */}
        <div className="text-center mt-10 mb-16">
          <h3 className="text-xl font-bold tracking-tight text-center bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent">
            Análises detalhadas
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00A298] to-[#1D3C44] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Gráficos específicos por setor */}
        <div className="mx-8 mb-12">
          {role === 'medicina' ? (
            // Dashboard medicina - quantidade equilibrada de gráficos
            <div className="space-y-8">
              {/* KPIs médicos - grid 4 colunas */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h3 className="text-sm font-medium text-gray-700">Agendamentos Hoje</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">24</p>
                  <p className="text-xs text-gray-500 mt-1">+3 desde ontem</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <h3 className="text-sm font-medium text-gray-700">Exames Realizados</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">87</p>
                  <p className="text-xs text-gray-500 mt-1">Este mês</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <h3 className="text-sm font-medium text-gray-700">Taxa de Presença</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">91%</p>
                  <p className="text-xs text-gray-500 mt-1">Média mensal</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow border border-orange-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <h3 className="text-sm font-medium text-gray-700">Tempo Médio</h3>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">28min</p>
                  <p className="text-xs text-gray-500 mt-1">Por consulta</p>
                </div>
              </div>

              {/* Grid de 4 gráficos - 2x2 */}
              <div className="grid grid-cols-2 gap-8">
                {/* Tipos de Exames */}
                <div className="bg-white rounded-xl p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h2 className="text-lg font-bold text-slate-800">Tipos de Exames</h2>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Admissional', value: 45, fill: '#00A298' },
                            { name: 'Periódico', value: 32, fill: '#1D3C44' },
                            { name: 'Demissional', value: 18, fill: '#4ECDC4' },
                            { name: 'Retorno', value: 12, fill: '#81C784' },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {[
                            { name: 'Admissional', value: 45, fill: '#00A298' },
                            { name: 'Periódico', value: 32, fill: '#1D3C44' },
                            { name: 'Demissional', value: 18, fill: '#4ECDC4' },
                            { name: 'Retorno', value: 12, fill: '#81C784' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Agendamentos Semanais */}
                <div className="bg-white rounded-xl p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <h2 className="text-lg font-bold text-slate-800">Agendamentos Semanais</h2>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { dia: 'Seg', agendamentos: 32 },
                        { dia: 'Ter', agendamentos: 28 },
                        { dia: 'Qua', agendamentos: 35 },
                        { dia: 'Qui', agendamentos: 42 },
                        { dia: 'Sex', agendamentos: 38 },
                        { dia: 'Sáb', agendamentos: 15 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="dia" fontSize={11} />
                        <YAxis fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="agendamentos" fill="#1D3C44" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status dos Pacientes */}
                <div className="bg-white rounded-xl p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <h2 className="text-lg font-bold text-slate-800">Status dos Pacientes</h2>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { status: 'Apto', quantidade: 142 },
                        { status: 'Inapto Temp.', quantidade: 8 },
                        { status: 'Inapto Def.', quantidade: 3 },
                        { status: 'Pendente', quantidade: 12 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="status" fontSize={10} />
                        <YAxis fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="quantidade" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Horários de Maior Fluxo */}
                <div className="bg-white rounded-xl p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <h2 className="text-lg font-bold text-slate-800">Horários de Maior Fluxo</h2>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { horario: '08h-10h', pacientes: 25 },
                        { horario: '10h-12h', pacientes: 18 },
                        { horario: '12h-14h', pacientes: 8 },
                        { horario: '14h-16h', pacientes: 22 },
                        { horario: '16h-18h', pacientes: 15 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="horario" fontSize={10} />
                        <YAxis fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="pacientes" fill="#4F46E5" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Gráfico de evolução mensal - mais largo */}
              <div className="bg-white rounded-xl p-6 shadow-lg border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h2 className="text-lg font-bold text-slate-800">Performance Mensal - Medicina</h2>
                </div>
                <p className="text-gray-600 mb-4">Evolução de exames e agendamentos nos últimos 6 meses</p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { mes: 'Jul', realizados: 285, agendados: 320 },
                      { mes: 'Ago', realizados: 312, agendados: 340 },
                      { mes: 'Set', realizados: 298, agendados: 325 },
                      { mes: 'Out', realizados: 345, agendados: 380 },
                      { mes: 'Nov', realizados: 378, agendados: 395 },
                      { mes: 'Dez', realizados: 392, agendados: 410 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="realizados"
                        stroke="#00A298"
                        strokeWidth={3}
                        dot={{ fill: '#00A298', strokeWidth: 2, r: 4 }}
                        name="Exames Realizados"
                      />
                      <Line
                        type="monotone"
                        dataKey="agendados"
                        stroke="#1D3C44"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#1D3C44', strokeWidth: 1, r: 3 }}
                        name="Agendamentos"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : role === 'comercial' ? (
            // Dashboard comercial - layout simples por enquanto
            <div className="bg-white rounded-xl p-8 shadow-lg border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Comercial</h2>
              </div>
              <p className="text-slate-600 mb-8 text-lg">Métricas e indicadores do setor comercial</p>
              <GoalsVsActualSlide />
            </div>
          ) : (
            // Para diretoria, mantém o dashboard padrão
            <GoalsVsActualSlide />
          )}
        </div>
      </div>
    </div>
  )
}