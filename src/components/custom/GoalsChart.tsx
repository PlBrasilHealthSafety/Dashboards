import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

// PLBrasil color palette - cores solicitadas
const COLORS = {
  primary: '#00A298',    // Verde PLBrasil principal
  secondary: '#1D3C44',  // Verde Escuro PLBrasil
  accent: '#2563eb',     // Azul
  background: '#FFFFFF',
  text: '#1D3C44',
  // Cores customizadas conforme solicitação
  medicine: '#00A298',   // Verde PLBrasil (mantém)
  commercial: '#2563eb', // Azul conforme solicitado
  operations: '#8B7355', // Marrom suave (não tão forte)
  target: '#6B7280'      // Cinza moderno
}

interface GoalsChartProps {
  year: number
  data?: any[]
}

const defaultData = {
  2024: [
    { mes: 'Jan', medicina: 85, comercial: 92, operacoes: 78, meta: 80 },
    { mes: 'Fev', medicina: 88, comercial: 95, operacoes: 82, meta: 85 },
    { mes: 'Mar', medicina: 92, comercial: 88, operacoes: 85, meta: 90 },
    { mes: 'Abr', medicina: 95, comercial: 92, operacoes: 88, meta: 90 },
    { mes: 'Mai', medicina: 98, comercial: 96, operacoes: 92, meta: 95 },
    { mes: 'Jun', medicina: 102, comercial: 98, operacoes: 95, meta: 95 },
    { mes: 'Jul', medicina: 105, comercial: 101, operacoes: 98, meta: 100 },
    { mes: 'Ago', medicina: 103, comercial: 99, operacoes: 96, meta: 100 },
    { mes: 'Set', medicina: 108, comercial: 103, operacoes: 100, meta: 105 },
    { mes: 'Out', medicina: 110, comercial: 105, operacoes: 102, meta: 105 },
    { mes: 'Nov', medicina: 112, comercial: 108, operacoes: 105, meta: 110 },
    { mes: 'Dez', medicina: 115, comercial: 110, operacoes: 108, meta: 110 }
  ],
  2023: [
    { mes: 'Jan', medicina: 75, comercial: 82, operacoes: 68, meta: 70 },
    { mes: 'Fev', medicina: 78, comercial: 85, operacoes: 72, meta: 75 },
    { mes: 'Mar', medicina: 82, comercial: 78, operacoes: 75, meta: 80 },
    { mes: 'Abr', medicina: 85, comercial: 82, operacoes: 78, meta: 80 },
    { mes: 'Mai', medicina: 88, comercial: 86, operacoes: 82, meta: 85 },
    { mes: 'Jun', medicina: 92, comercial: 88, operacoes: 85, meta: 85 },
    { mes: 'Jul', medicina: 95, comercial: 91, operacoes: 88, meta: 90 },
    { mes: 'Ago', medicina: 93, comercial: 89, operacoes: 86, meta: 90 },
    { mes: 'Set', medicina: 98, comercial: 93, operacoes: 90, meta: 95 },
    { mes: 'Out', medicina: 100, comercial: 95, operacoes: 92, meta: 95 },
    { mes: 'Nov', medicina: 102, comercial: 98, operacoes: 95, meta: 100 },
    { mes: 'Dez', medicina: 105, comercial: 100, operacoes: 98, meta: 100 }
  ],
  2022: [
    { mes: 'Jan', medicina: 65, comercial: 72, operacoes: 58, meta: 60 },
    { mes: 'Fev', medicina: 68, comercial: 75, operacoes: 62, meta: 65 },
    { mes: 'Mar', medicina: 72, comercial: 68, operacoes: 65, meta: 70 },
    { mes: 'Abr', medicina: 75, comercial: 72, operacoes: 68, meta: 70 },
    { mes: 'Mai', medicina: 78, comercial: 76, operacoes: 72, meta: 75 },
    { mes: 'Jun', medicina: 82, comercial: 78, operacoes: 75, meta: 75 },
    { mes: 'Jul', medicina: 85, comercial: 81, operacoes: 78, meta: 80 },
    { mes: 'Ago', medicina: 83, comercial: 79, operacoes: 76, meta: 80 },
    { mes: 'Set', medicina: 88, comercial: 83, operacoes: 80, meta: 85 },
    { mes: 'Out', medicina: 90, comercial: 85, operacoes: 82, meta: 85 },
    { mes: 'Nov', medicina: 92, comercial: 88, operacoes: 85, meta: 90 },
    { mes: 'Dez', medicina: 95, comercial: 90, operacoes: 88, meta: 90 }
  ],
  2021: [
    { mes: 'Jan', medicina: 55, comercial: 62, operacoes: 48, meta: 50 },
    { mes: 'Fev', medicina: 58, comercial: 65, operacoes: 52, meta: 55 },
    { mes: 'Mar', medicina: 62, comercial: 58, operacoes: 55, meta: 60 },
    { mes: 'Abr', medicina: 65, comercial: 62, operacoes: 58, meta: 60 },
    { mes: 'Mai', medicina: 68, comercial: 66, operacoes: 62, meta: 65 },
    { mes: 'Jun', medicina: 72, comercial: 68, operacoes: 65, meta: 65 },
    { mes: 'Jul', medicina: 75, comercial: 71, operacoes: 68, meta: 70 },
    { mes: 'Ago', medicina: 73, comercial: 69, operacoes: 66, meta: 70 },
    { mes: 'Set', medicina: 78, comercial: 73, operacoes: 70, meta: 75 },
    { mes: 'Out', medicina: 80, comercial: 75, operacoes: 72, meta: 75 },
    { mes: 'Nov', medicina: 82, comercial: 78, operacoes: 75, meta: 80 },
    { mes: 'Dez', medicina: 85, comercial: 80, operacoes: 78, meta: 80 }
  ],
  2025: [
    { mes: 'Jan', medicina: 118, comercial: 115, operacoes: 112, meta: 115 },
    { mes: 'Fev', medicina: 122, comercial: 118, operacoes: 115, meta: 120 },
    { mes: 'Mar', medicina: 125, comercial: 122, operacoes: 118, meta: 120 },
    { mes: 'Abr', medicina: 128, comercial: 125, operacoes: 122, meta: 125 },
    { mes: 'Mai', medicina: 132, comercial: 128, operacoes: 125, meta: 130 },
    { mes: 'Jun', medicina: 135, comercial: 132, operacoes: 128, meta: 130 },
    { mes: 'Jul', medicina: 138, comercial: 135, operacoes: 132, meta: 135 },
    { mes: 'Ago', medicina: 142, comercial: 138, operacoes: 135, meta: 140 },
    { mes: 'Set', medicina: 145, comercial: 142, operacoes: 138, meta: 140 },
    { mes: 'Out', medicina: 148, comercial: 145, operacoes: 142, meta: 145 },
    { mes: 'Nov', medicina: 152, comercial: 148, operacoes: 145, meta: 150 },
    { mes: 'Dez', medicina: 155, comercial: 152, operacoes: 148, meta: 150 }
  ]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function GoalsChart({ year, data }: GoalsChartProps) {
  const chartData = data || defaultData[year as keyof typeof defaultData] || defaultData[2024]

  return (
    <Card className="shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
          🎯 Metas vs Realizado - {year}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Acompanhamento mensal do desempenho por setor comparado às metas estabelecidas
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="mes" 
              stroke={COLORS.text}
              fontSize={12}
            />
            <YAxis 
              stroke={COLORS.text}
              fontSize={12}
              label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Linha de referência para a meta */}
            <ReferenceLine 
              y={100} 
              stroke={COLORS.target} 
              strokeDasharray="5 5" 
              label={{ value: "Meta Base (100%)", position: "topRight" }}
            />
            
            <Bar 
              dataKey="medicina" 
              fill={COLORS.medicine}
              radius={[2, 2, 0, 0]}
              name="Medicina"
            />
            <Bar 
              dataKey="comercial" 
              fill={COLORS.commercial}
              radius={[2, 2, 0, 0]}
              name="Comercial"
            />
            <Bar 
              dataKey="operacoes" 
              fill={COLORS.operations}
              radius={[2, 2, 0, 0]}
              name="Operações"
            />
            <Bar 
              dataKey="meta" 
              fill={COLORS.target}
              radius={[2, 2, 0, 0]}
              name="Meta Trimestral"
              fillOpacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
