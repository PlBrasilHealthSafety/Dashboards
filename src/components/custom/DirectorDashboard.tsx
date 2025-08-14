import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  RadialBarChart,
  RadialBar,
} from 'recharts'

// PLBrasil color palette com variações de opacidade
const COLORS = {
  primary: '#00A298',
  secondary: '#1D3C44', 
  accent: '#AECECB',
  background: '#FFFFFF',
  text: '#1D3C44',
  // Variações com opacidade para diversidade visual
  primaryAlpha80: 'rgba(0, 162, 152, 0.8)',
  primaryAlpha60: 'rgba(0, 162, 152, 0.6)',
  primaryAlpha40: 'rgba(0, 162, 152, 0.4)',
  secondaryAlpha80: 'rgba(29, 60, 68, 0.8)',
  secondaryAlpha60: 'rgba(29, 60, 68, 0.6)',
  accentAlpha80: 'rgba(174, 206, 203, 0.8)',
  accentAlpha60: 'rgba(174, 206, 203, 0.6)',
  // Cores complementares para variação
  teal500: '#14b8a6',
  teal300: '#5eead4',
  slate600: '#475569',
  slate400: '#94a3b8',
  emerald500: '#10b981',
  orange500: '#f97316'
}

// Dados consolidados de todos os setores
const visaoGeralSetores = [
  { setor: 'Medicina', receita: 890000, crescimento: 12.5, satisfacao: 94 },
  { setor: 'Comercial', receita: 1250000, crescimento: 8.7, satisfacao: 87 },
  { setor: 'Operações', receita: 567000, crescimento: 15.2, satisfacao: 91 },
  { setor: 'Administrativo', receita: 234000, crescimento: 5.1, satisfacao: 88 }
]

const evolutionTrimestralData = [
  { trimestre: 'Q1', medicina: 850000, comercial: 1180000, operacoes: 520000, admin: 210000 },
  { trimestre: 'Q2', medicina: 890000, comercial: 1250000, operacoes: 567000, admin: 234000 },
  { trimestre: 'Q3', medicina: 945000, comercial: 1340000, operacoes: 598000, admin: 245000 },
  { trimestre: 'Q4', medicina: 980000, comercial: 1420000, operacoes: 635000, admin: 260000 }
]

const kpisConsolidados = [
  { categoria: 'Receita Total', valor: 'R$ 2.94M', crescimento: '+11.2%', cor: COLORS.primary },
  { categoria: 'Clientes Ativos', valor: '1.847', crescimento: '+18.5%', cor: COLORS.primary },
  { categoria: 'Satisfação Geral', valor: '90%', crescimento: '+2.3%', cor: COLORS.primary },
  { categoria: 'Eficiência Operacional', valor: '87%', crescimento: '+5.7%', cor: COLORS.primary }
]

const distribuicaoReceitaData = [
  { name: 'Comercial', value: 42.6, color: COLORS.primary },
  { name: 'Medicina', value: 30.3, color: COLORS.secondary },
  { name: 'Operações', value: 19.3, color: COLORS.accent },
  { name: 'Administrativo', value: 7.8, color: '#10b981' }
]

const metricasTempoRealData = [
  { indicador: 'ROI Geral', valor: 145, meta: 130 },
  { indicador: 'Produtividade', valor: 92, meta: 90 },
  { indicador: 'Qualidade', valor: 88, meta: 85 },
  { indicador: 'Inovação', valor: 76, meta: 80 }
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${typeof entry.value === 'number' && entry.value > 10000 
              ? `R$ ${(entry.value / 1000).toFixed(0)}k` 
              : entry.value}${typeof entry.value === 'number' && entry.value <= 100 ? '%' : ''}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DirectorDashboard() {
  return (
          <div className="space-y-6 p-6">
      {/* Dashboard Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1D3C44' }}>Visão Executiva - Diretoria</h2>
        <p className="text-sm text-gray-600">Acompanhamento consolidado de todos os setores</p>
      </div>

      {/* KPIs Consolidados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpisConsolidados.map((kpi, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: kpi.cor }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs text-gray-600">{kpi.categoria}</CardDescription>
              <div className="flex items-end justify-between">
                <CardTitle className="text-2xl font-bold" style={{ color: kpi.cor }}>{kpi.valor}</CardTitle>
                <span className="text-sm font-medium text-green-600">{kpi.crescimento}</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Evolução Trimestral por Setor */}
              <Card className="shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-slate-800">📊 Evolução Trimestral por Setor</CardTitle>
              <Badge variant="secondary" className="text-xs">2024</Badge>
            </div>
            <CardDescription className="text-xs text-slate-600">Receita consolidada de todos os setores ao longo do ano</CardDescription>
          </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={evolutionTrimestralData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="trimestre" stroke={COLORS.text} fontSize={12} />
              <YAxis 
                stroke={COLORS.text} 
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="medicina" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                name="Medicina"
              />
              <Line 
                type="monotone" 
                dataKey="comercial" 
                stroke={COLORS.secondary} 
                strokeWidth={3}
                name="Comercial"
              />
              <Line 
                type="monotone" 
                dataKey="operacoes" 
                stroke={COLORS.accent} 
                strokeWidth={3}
                name="Operações"
              />
              <Line 
                type="monotone" 
                dataKey="admin" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Administrativo"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Segunda linha - Visão geral e distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance por Setor */}
        <Card className="shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">🏢 Performance por Setor</CardTitle>
            <CardDescription className="text-xs text-slate-600">Métricas consolidadas do último trimestre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visaoGeralSetores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="setor" stroke={COLORS.text} fontSize={11} angle={-45} textAnchor="end" height={80} />
                <YAxis 
                  stroke={COLORS.text} 
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="receita" fill={COLORS.primaryAlpha80} name="Receita" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Receita */}
        <Card className="shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">💰 Distribuição de Receita</CardTitle>
            <CardDescription className="text-xs text-slate-600">Participação de cada setor na receita total</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoReceitaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
                  labelLine={false}
                >
                  {distribuicaoReceitaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Participação']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Tempo Real */}
      <Card className="shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">⚡ Indicadores em Tempo Real</CardTitle>
            <Badge variant="outline" className="text-xs">Atualizado agora</Badge>
          </div>
          <CardDescription className="text-xs">Principais métricas de desempenho organizacional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metricasTempoRealData.map((metrica, index) => (
              <div key={index} className="text-center space-y-3">
                <p className="text-sm font-medium text-gray-600">{metrica.indicador}</p>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={120}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[metrica]}>
                      <RadialBar
                        dataKey="valor"
                        cornerRadius={10}
                        fill={metrica.valor >= metrica.meta ? COLORS.primaryAlpha80 : COLORS.orange500}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-bold" style={{ color: COLORS.primary }}>
                        {metrica.valor}%
                      </p>
                      <p className="text-xs text-gray-500">Meta: {metrica.meta}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">🎯 Metas Atingidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Medicina</span>
                <span className="font-bold text-green-600">105%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Comercial</span>
                <span className="font-bold text-green-600">103%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Operações</span>
                <span className="font-bold" style={{ color: COLORS.primary }}>98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Administrativo</span>
                <span className="font-bold text-orange-500">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">📈 Crescimento Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>+11.2%</p>
              <p className="text-sm text-gray-600">Crescimento consolidado</p>
              <p className="text-xs text-green-600">Acima da meta de 8%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">⭐ Destaque do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold" style={{ color: COLORS.primary }}>Setor Medicina</p>
              <p className="text-sm text-gray-600">Maior crescimento</p>
              <p className="text-xs text-green-600">+15.2% vs mês anterior</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção adicional de gráficos - Análises avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tendência vs Mercado */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              📊 Performance vs Mercado
            </CardTitle>
            <p className="text-xs text-muted-foreground">Comparativo com o setor</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[
                { mes: 'Jan', empresa: 85, mercado: 78 },
                { mes: 'Fev', empresa: 88, mercado: 80 },
                { mes: 'Mar', empresa: 92, mercado: 83 },
                { mes: 'Abr', empresa: 95, mercado: 85 },
                { mes: 'Mai', empresa: 98, mercado: 87 },
                { mes: 'Jun', empresa: 102, mercado: 89 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" stroke={COLORS.text} fontSize={11} />
                <YAxis stroke={COLORS.text} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="empresa" 
                  stroke={COLORS.primary} 
                  strokeWidth={3}
                  name="Nossa Empresa"
                  dot={{ fill: COLORS.primary, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mercado" 
                  stroke={COLORS.secondary} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Média do Mercado"
                  dot={{ fill: COLORS.secondary, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lucratividade por Categoria */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              💰 Margem de Lucro por Categoria
            </CardTitle>
            <p className="text-xs text-muted-foreground">Rentabilidade por linha de negócio</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { categoria: 'Medicina', margem: 35.2 },
                { categoria: 'Comercial', margem: 28.7 },
                { categoria: 'Consultorias', margem: 42.1 },
                { categoria: 'Treinamentos', margem: 38.9 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="categoria" 
                  stroke={COLORS.text} 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke={COLORS.text} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="margem" 
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  name="Margem (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Custos */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              💸 Distribuição de Custos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Estrutura de custos operacionais</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { setor: 'Pessoal', valor: 1200, percentual: 45, color: COLORS.primary },
                    { setor: 'Infraestrutura', valor: 580, percentual: 22, color: COLORS.secondary },
                    { setor: 'Marketing', valor: 420, percentual: 16, color: COLORS.accent },
                    { setor: 'Tecnologia', valor: 300, percentual: 11, color: '#10b981' },
                    { setor: 'Outros', valor: 160, percentual: 6, color: '#f59e0b' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ setor, percentual }) => `${setor} ${percentual}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="percentual"
                >
                  {[
                    { setor: 'Pessoal', valor: 1200, percentual: 45, color: COLORS.primary },
                    { setor: 'Infraestrutura', valor: 580, percentual: 22, color: COLORS.secondary },
                    { setor: 'Marketing', valor: 420, percentual: 16, color: COLORS.accent },
                    { setor: 'Tecnologia', valor: 300, percentual: 11, color: '#10b981' },
                    { setor: 'Outros', valor: 160, percentual: 6, color: '#f59e0b' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPIs financeiros detalhados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xl bg-white/60 backdrop-blur-sm border border-white/30 border-l-4" style={{ borderLeftColor: COLORS.primary }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">EBITDA</p>
              <p className="text-xl font-bold" style={{ color: COLORS.primary }}>R$ 890K</p>
              <span className="text-xs font-medium text-green-600">+15.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-white/60 backdrop-blur-sm border border-white/30 border-l-4" style={{ borderLeftColor: COLORS.secondary }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">Fluxo de Caixa</p>
              <p className="text-xl font-bold" style={{ color: COLORS.secondary }}>R$ 1.2M</p>
              <span className="text-xs font-medium text-green-600">+8.7%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-white/60 backdrop-blur-sm border border-white/30 border-l-4" style={{ borderLeftColor: COLORS.accent }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">ROE</p>
              <p className="text-xl font-bold" style={{ color: COLORS.accent }}>23.5%</p>
              <span className="text-xs font-medium text-green-600">+4.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-white/60 backdrop-blur-sm border border-white/30 border-l-4" style={{ borderLeftColor: '#f59e0b' }}>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">Ticket Médio</p>
              <p className="text-xl font-bold" style={{ color: '#f59e0b' }}>R$ 1.590</p>
              <span className="text-xs font-medium text-green-600">+12.8%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
