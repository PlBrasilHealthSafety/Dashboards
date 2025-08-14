import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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

// PLBrasil color palette - cores mais distintas
const COLORS = {
  primary: '#00A298',    // Teal - Medicina
  secondary: '#1D3C44',  // Dark Blue - Comercial
  accent: '#3b82f6',     // Blue - Operações (mais distinta)
  background: '#FFFFFF',
  text: '#1D3C44'
}

// Dados para os gráficos do carousel
const performanceData = [
  { mes: 'Jan', performance: 78, meta: 80 },
  { mes: 'Fev', performance: 85, meta: 80 },
  { mes: 'Mar', performance: 92, meta: 85 },
  { mes: 'Abr', performance: 88, meta: 85 },
  { mes: 'Mai', performance: 95, meta: 90 },
  { mes: 'Jun', performance: 102, meta: 95 }
]

const setoresData = [
  { name: 'Medicina', value: 45, color: COLORS.primary },
  { name: 'Comercial', value: 35, color: COLORS.secondary },
  { name: 'Operações', value: 20, color: COLORS.accent }
]

const crescimentoData = [
  { trimestre: 'Q1', crescimento: 8.5 },
  { trimestre: 'Q2', crescimento: 12.3 },
  { trimestre: 'Q3', crescimento: 15.7 },
  { trimestre: 'Q4', crescimento: 18.9 }
]

// Componentes de slides com imagens para o carousel
export function ImageSlide1() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10" />
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600">
        <div className="text-center text-white z-20 relative">
          <h3 className="text-4xl font-bold mb-4">Excelência em Saúde</h3>
          <p className="text-2xl opacity-90">Cuidando de você com tecnologia e humanização</p>
        </div>
      </div>
    </div>
  )
}

export function ImageSlide2() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-green-50 to-teal-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10" />
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600">
        <div className="text-center text-white z-20 relative">
          <h3 className="text-4xl font-bold mb-4">Inovação Médica</h3>
          <p className="text-2xl opacity-90">Equipamentos de última geração para seu bem-estar</p>
        </div>
      </div>
    </div>
  )
}

// Gráficos otimizados para o carousel
export function GeneralChart1() {
  return (
    <div className="h-full w-full p-3 bg-gradient-to-br from-slate-50 to-blue-50">
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="text-center pb-1">
          <CardTitle className="text-lg font-bold" style={{ color: COLORS.primary }}>
            📊 Performance Geral
          </CardTitle>
          <p className="text-xs text-gray-600">Consolidado</p>
        </CardHeader>
        <CardContent className="h-full p-1">
          <ResponsiveContainer width="100%" height="70%">
            <AreaChart data={performanceData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="mes" 
                stroke={COLORS.text}
                fontSize={9}
                tick={{ fontSize: 9 }}
              />
              <YAxis 
                stroke={COLORS.text}
                fontSize={9}
                tick={{ fontSize: 9 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="performance"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.7}
                name="Performance %"
              />
              <Area
                type="monotone"
                dataKey="meta"
                stroke={COLORS.secondary}
                fill={COLORS.accent}
                fillOpacity={0.5}
                name="Meta %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function ImageSlide3() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10" />
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
        <div className="text-center text-white z-20 relative">
          <h3 className="text-4xl font-bold mb-4">Equipe Especializada</h3>
          <p className="text-2xl opacity-90">Profissionais qualificados e dedicados</p>
        </div>
      </div>
    </div>
  )
}

export function GeneralChart2() {
  return (
    <div className="h-full w-full p-3 bg-gradient-to-br from-green-50 to-teal-50">
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="text-center pb-1">
          <CardTitle className="text-lg font-bold" style={{ color: COLORS.primary }}>
            🏢 Distribuição por Setor
          </CardTitle>
          <p className="text-xs text-gray-600">Receita total</p>
        </CardHeader>
        <CardContent className="h-full p-1">
          <ResponsiveContainer width="100%" height="75%">
            <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <Pie
                data={setoresData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {setoresData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                labelStyle={{ color: COLORS.text }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '10px',
                  paddingTop: '5px'
                }}
                formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function ImageSlide4() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10" />
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">
        <div className="text-center text-white z-20 relative">
          <h3 className="text-4xl font-bold mb-4">Atendimento Humanizado</h3>
          <p className="text-2xl opacity-90">Cuidado integral para toda a família</p>
        </div>
      </div>
    </div>
  )
}

export function GeneralChart3() {
  return (
    <div className="h-full w-full p-3 bg-gradient-to-br from-purple-50 to-indigo-50">
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="text-center pb-1">
          <CardTitle className="text-lg font-bold" style={{ color: COLORS.primary }}>
            📈 Crescimento Trimestral
          </CardTitle>
          <p className="text-xs text-gray-600">Evolução trimestral</p>
        </CardHeader>
        <CardContent className="h-full p-1">
          <ResponsiveContainer width="100%" height="70%">
            <BarChart data={crescimentoData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="trimestre" 
                stroke={COLORS.text}
                fontSize={9}
                tick={{ fontSize: 9 }}
              />
              <YAxis 
                stroke={COLORS.text}
                fontSize={9}
                tick={{ fontSize: 9 }}
              />
              <Tooltip />
              <Bar 
                dataKey="crescimento" 
                fill={COLORS.primary}
                radius={[2, 2, 0, 0]}
                name="Crescimento (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function ImageSlide5() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-orange-50 to-red-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10" />
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
        <div className="text-center text-white z-20 relative">
          <h3 className="text-4xl font-bold mb-4">Resultados Comprovados</h3>
          <p className="text-2xl opacity-90">Mais de 10.000 pacientes atendidos com excelência</p>
        </div>
      </div>
    </div>
  )
}



export function ImageSlide6() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10" />
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
        <div className="text-center text-white z-20 relative">
          <h3 className="text-4xl font-bold mb-4">Tecnologia Avançada</h3>
          <p className="text-2xl opacity-90">Diagnósticos precisos com equipamentos modernos</p>
        </div>
      </div>
    </div>
  )
}

export function ImageSlide7() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10" />
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="text-center text-white z-20 relative">
          <h3 className="text-4xl font-bold mb-4">Compromisso Social</h3>
          <p className="text-2xl opacity-90">Saúde acessível e de qualidade para todos</p>
        </div>
      </div>
    </div>
  )
}

export function ImageSlide8() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10" />
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-center text-white z-20 relative">
          <h3 className="text-4xl font-bold mb-4">Futuro da Medicina</h3>
          <p className="text-2xl opacity-90">Sempre em evolução para servir melhor</p>
        </div>
      </div>
    </div>
  )
}
