import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// PLBrasil color palette
const COLORS = {
  primary: '#00A298',
  secondary: '#1D3C44', 
  accent: '#AECECB',
  background: '#FFFFFF',
  text: '#1D3C44'
}

// Dados comerciais
const vendasMensaisData = [
  { mes: 'Jan', vendas: 245000, meta: 250000 },
  { mes: 'Fev', vendas: 267000, meta: 250000 },
  { mes: 'Mar', vendas: 289000, meta: 275000 },
  { mes: 'Abr', vendas: 312000, meta: 300000 },
  { mes: 'Mai', vendas: 298000, meta: 300000 },
  { mes: 'Jun', vendas: 334000, meta: 325000 }
]

const leadsPorFonteData = [
  { fonte: 'Digital', leads: 45, cor: COLORS.primary },
  { fonte: 'Referência', leads: 28, cor: COLORS.secondary },
  { fonte: 'Eventos', leads: 15, cor: COLORS.accent },
  { fonte: 'Parcerias', leads: 12, cor: '#10b981' }
]

const conversaoFunilData = [
  { etapa: 'Leads', quantidade: 1250 },
  { etapa: 'Qualificados', quantidade: 875 },
  { etapa: 'Propostas', quantidade: 456 },
  { etapa: 'Negociação', quantidade: 234 },
  { etapa: 'Fechados', quantidade: 156 }
]

const performanceVendedoresData = [
  { vendedor: 'Ana Silva', vendas: 89000, meta: 85000 },
  { vendedor: 'Carlos Lima', vendas: 76000, meta: 80000 },
  { vendedor: 'Maria Santos', vendas: 94000, meta: 90000 },
  { vendedor: 'João Pereira', vendas: 67000, meta: 70000 },
  { vendedor: 'Paula Costa', vendas: 102000, meta: 95000 }
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${typeof entry.value === 'number' && entry.value > 1000 
              ? `R$ ${(entry.value / 1000).toFixed(0)}k` 
              : entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function CommercialDashboard() {
  return (
    <div className="space-y-6 p-6" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Vendas do Mês</CardDescription>
            <CardTitle className="text-2xl font-bold" style={{ color: COLORS.primary }}>R$ 334k</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Leads Ativos</CardDescription>
            <CardTitle className="text-2xl font-bold" style={{ color: COLORS.primary }}>1.250</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Taxa Conversão</CardDescription>
            <CardTitle className="text-2xl font-bold" style={{ color: COLORS.primary }}>12.5%</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-gray-600">Meta Atingida</CardDescription>
            <CardTitle className="text-2xl font-bold" style={{ color: COLORS.primary }}>103%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Vendas Mensais vs Meta */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">📈 Vendas Mensais vs Meta</CardTitle>
            <Badge variant="secondary" className="text-xs">Últimos 6 meses</Badge>
          </div>
          <CardDescription className="text-xs">Acompanhamento de performance comercial</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={vendasMensaisData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" stroke={COLORS.text} fontSize={12} />
              <YAxis 
                stroke={COLORS.text} 
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="vendas" 
                stroke={COLORS.primary} 
                fill={COLORS.primary}
                fillOpacity={0.3}
                name="Vendas Realizadas"
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke={COLORS.secondary}
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Segunda linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads por Fonte */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🎯 Leads por Fonte</CardTitle>
            <CardDescription className="text-xs">Origem dos leads este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={leadsPorFonteData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke={COLORS.text} fontSize={12} />
                <YAxis dataKey="fonte" type="category" stroke={COLORS.text} fontSize={12} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="leads" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funil de Conversão */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🚀 Funil de Conversão</CardTitle>
            <CardDescription className="text-xs">Pipeline de vendas atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversaoFunilData.map((item, index) => {
                const porcentagem = ((item.quantidade / conversaoFunilData[0].quantidade) * 100).toFixed(1)
                return (
                  <div key={item.etapa} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.etapa}</span>
                      <span className="font-medium">{item.quantidade} ({porcentagem}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${porcentagem}%`,
                          backgroundColor: COLORS.primary,
                          opacity: 1 - (index * 0.15)
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance dos Vendedores */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">👥 Performance dos Vendedores</CardTitle>
            <Badge variant="outline" className="text-xs">Este mês</Badge>
          </div>
          <CardDescription className="text-xs">Vendas realizadas vs meta individual</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceVendedoresData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="vendedor" stroke={COLORS.text} fontSize={11} angle={-45} textAnchor="end" height={80} />
              <YAxis 
                stroke={COLORS.text} 
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="vendas" fill={COLORS.primary} name="Vendas Realizadas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="meta" fill={COLORS.accent} name="Meta" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Indicadores de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">🏆 Top Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold" style={{ color: COLORS.primary }}>Plano Premium</p>
              <p className="text-sm text-gray-600">156 vendas este mês</p>
              <p className="text-xs text-green-600">+23% vs mês anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">💰 Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold" style={{ color: COLORS.primary }}>R$ 2.142</p>
              <p className="text-sm text-gray-600">Valor médio por venda</p>
              <p className="text-xs text-green-600">+8% vs mês anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">⏱️ Ciclo de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold" style={{ color: COLORS.primary }}>18 dias</p>
              <p className="text-sm text-gray-600">Tempo médio de fechamento</p>
              <p className="text-xs text-red-500">+2 dias vs mês anterior</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
