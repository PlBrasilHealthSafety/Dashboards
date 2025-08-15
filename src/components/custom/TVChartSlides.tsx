import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

// Dados para gráfico de pizza - Distribuição por Setor
const pieChartData = [
  { name: 'Comercial', value: 35, color: '#1D3C44' },
  { name: 'Medicina', value: 42, color: '#00A298' },
  { name: 'Operações', value: 18, color: '#3B82F6' },
  { name: 'Administrativo', value: 5, color: '#8B8B8B' },
]

// Dados para gráfico de barras - Performance Mensal
const barChartData = [
  { mes: 'Jan', Comercial: 85, Medicina: 92, Operacoes: 78 },
  { mes: 'Fev', Medicina: 88, Comercial: 79, Operacoes: 82 },
  { mes: 'Mar', Comercial: 91, Medicina: 95, Operacoes: 85 },
  { mes: 'Abr', Medicina: 89, Comercial: 87, Operacoes: 88 },
  { mes: 'Mai', Comercial: 93, Medicina: 97, Operacoes: 91 },
  { mes: 'Jun', Medicina: 94, Comercial: 89, Operacoes: 86 },
]

// Dados para gráfico de barras - Metas vs Realizado
const metasRealizadoData = [
  { setor: 'Comercial', Meta: 100, Realizado: 85 },
  { setor: 'Medicina', Meta: 100, Realizado: 92 },
  { setor: 'Operações', Meta: 100, Realizado: 78 },
  { setor: 'Admin', Meta: 100, Realizado: 88 },
]

// Slide 1 - Gráfico de Pizza: Distribuição por Setor
export function TVPieChartSlide() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          Distribuição por Setor
        </h2>
        <p className="text-lg text-slate-600">Participação percentual de cada área</p>
      </div>
      
      <div className="w-full h-96 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              fontSize={14}
              fontWeight="600"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '16px', fontWeight: '600' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Slide 2 - Gráfico de Barras: Performance Mensal
export function TVBarChartSlide() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          Performance Mensal
        </h2>
        <p className="text-lg text-slate-600">Evolução por setor ao longo do semestre</p>
      </div>
      
      <div className="w-full h-96 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="mes" 
              stroke="#64748b" 
              fontSize={14}
              fontWeight="600"
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={14}
              fontWeight="600"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '16px', fontWeight: '600' }}
            />
            <Bar dataKey="Comercial" fill="#1D3C44" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Medicina" fill="#00A298" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Operacoes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Slide 3 - Gráfico de Barras: Metas vs Realizado
export function TVGoalsChartSlide() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          Metas vs Realizado
        </h2>
        <p className="text-lg text-slate-600">Comparativo de desempenho por setor</p>
      </div>
      
      <div className="w-full h-96 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={metasRealizadoData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="setor" 
              stroke="#64748b" 
              fontSize={14}
              fontWeight="600"
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={14}
              fontWeight="600"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '16px', fontWeight: '600' }}
            />
            <Bar dataKey="Meta" fill="#AECECB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Realizado" fill="#00A298" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}