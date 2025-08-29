import { useMemo } from 'react'
import { DynamicTimerCarousel } from '@/components/custom/DynamicTimerCarousel'
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button'

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

export function ComercialPage() {

  const carouselItems = useMemo(() => {
    // 8 slides de PowerPoint + slide de aniversariantes
    const slides = [
      { id: 1, content: <PowerPointSlide1 />, duration: 30000 }, // 30 seconds
      { id: 2, content: <PowerPointSlide2 />, duration: 30000 }, // 30 seconds
      { id: 3, content: <PowerPointSlide3 />, duration: 30000 }, // 30 seconds
      { id: 4, content: <PowerPointSlide4 />, duration: 30000 }, // 30 seconds
      { id: 5, content: <AniversariantesSlide />, duration: 180000 }, // 3 minutes (180 seconds)
      { id: 6, content: <PowerPointSlide5 />, duration: 30000 }, // 30 seconds
      { id: 7, content: <PowerPointSlide6 />, duration: 30000 }, // 30 seconds
      { id: 8, content: <PowerPointSlide7 />, duration: 30000 }, // 30 seconds
      { id: 9, content: <PowerPointSlide8 />, duration: 30000 }, // 30 seconds
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
            Dashboard Comercial
          </h1>
          <p className="text-[#1D3C44]/80 mt-2">
            Métricas específicas do setor comercial
          </p>
        </div>

        {/* Seção do slide (carousel) com títulos e espaçamentos */}
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            {/* Título acima do slide */}

            {/* Carousel centralizado */}
            <div className="flex justify-center">
              <div className="w-full">
                <div className="w-full rounded-2xl shadow-2xl overflow-hidden bg-white aspect-[20/9]">
                  <DynamicTimerCarousel
                    items={carouselItems}
                    className="w-full h-full"
                    showNavigation
                    showPagination
                    pauseOnMouseEnter={true}
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

        {/* Dashboard específico do setor comercial */}
        <div className="mx-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-lg border">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <h2 className="text-2xl font-bold text-slate-800">Dashboard Comercial</h2>
            </div>
            <p className="text-slate-600 mb-8 text-lg">Métricas e indicadores do setor comercial</p>

            {/* KPIs comerciais - grid 4 colunas */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h3 className="text-sm font-medium text-blue-700">Vendas Hoje</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">R$ 45.2k</p>
                <p className="text-xs text-blue-500 mt-1">+12% vs ontem</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h3 className="text-sm font-medium text-green-700">Novos Clientes</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">18</p>
                <p className="text-xs text-green-500 mt-1">Este mês</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h3 className="text-sm font-medium text-purple-700">Taxa Conversão</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">24%</p>
                <p className="text-xs text-purple-500 mt-1">Média mensal</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <h3 className="text-sm font-medium text-orange-700">Ticket Médio</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">R$ 2.8k</p>
                <p className="text-xs text-orange-500 mt-1">Por cliente</p>
              </div>
            </div>

            {/* Grid de gráficos comerciais - 2x2 */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Vendas por Produto/Serviço */}
              <div className="bg-white rounded-xl p-6 shadow border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h2 className="text-lg font-bold text-slate-800">Vendas por Serviço</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Exames Ocupacionais', value: 45, fill: '#1D3C44' },
                          { name: 'Consultorias', value: 28, fill: '#00A298' },
                          { name: 'Treinamentos', value: 20, fill: '#4ECDC4' },
                          { name: 'Outros', value: 7, fill: '#81C784' },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {[
                          { name: 'Exames Ocupacionais', value: 45, fill: '#1D3C44' },
                          { name: 'Consultorias', value: 28, fill: '#00A298' },
                          { name: 'Treinamentos', value: 20, fill: '#4ECDC4' },
                          { name: 'Outros', value: 7, fill: '#81C784' },
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

              {/* Vendas Semanais */}
              <div className="bg-white rounded-xl p-6 shadow border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h2 className="text-lg font-bold text-slate-800">Vendas Semanais</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { dia: 'Seg', vendas: 8500 },
                      { dia: 'Ter', vendas: 12300 },
                      { dia: 'Qua', vendas: 9800 },
                      { dia: 'Qui', vendas: 15200 },
                      { dia: 'Sex', vendas: 11700 },
                      { dia: 'Sáb', vendas: 4200 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="dia" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Vendas']} />
                      <Bar dataKey="vendas" fill="#00A298" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pipeline de Vendas */}
              <div className="bg-white rounded-xl p-6 shadow border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h2 className="text-lg font-bold text-slate-800">Pipeline de Vendas</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { etapa: 'Prospecção', quantidade: 45 },
                      { etapa: 'Qualificação', quantidade: 28 },
                      { etapa: 'Proposta', quantidade: 18 },
                      { etapa: 'Negociação', quantidade: 12 },
                      { etapa: 'Fechamento', quantidade: 8 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="etapa" fontSize={10} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Origem dos Leads */}
              <div className="bg-white rounded-xl p-6 shadow border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <h2 className="text-lg font-bold text-slate-800">Origem dos Leads</h2>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { origem: 'Site', leads: 32 },
                      { origem: 'Indicação', leads: 28 },
                      { origem: 'LinkedIn', leads: 18 },
                      { origem: 'Telefone', leads: 15 },
                      { origem: 'Eventos', leads: 12 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="origem" fontSize={10} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="leads" fill="#4F46E5" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Gráfico de evolução mensal - mais largo */}
            <div className="bg-white rounded-xl p-6 shadow border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h2 className="text-lg font-bold text-slate-800">Performance Mensal - Comercial</h2>
              </div>
              <p className="text-gray-600 mb-4">Evolução de vendas e metas nos últimos 6 meses</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { mes: 'Jul', vendas: 185000, meta: 200000 },
                    { mes: 'Ago', vendas: 212000, meta: 210000 },
                    { mes: 'Set', vendas: 198000, meta: 220000 },
                    { mes: 'Out', vendas: 245000, meta: 230000 },
                    { mes: 'Nov', vendas: 278000, meta: 240000 },
                    { mes: 'Dez', vendas: 292000, meta: 250000 },
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
                      formatter={(value) => [`R$ ${value}`, '']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="vendas"
                      stroke="#00A298"
                      strokeWidth={3}
                      dot={{ fill: '#00A298', strokeWidth: 2, r: 4 }}
                      name="Vendas Realizadas"
                    />
                    <Line
                      type="monotone"
                      dataKey="meta"
                      stroke="#1D3C44"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#1D3C44', strokeWidth: 1, r: 3 }}
                      name="Meta"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </div>
  )
}