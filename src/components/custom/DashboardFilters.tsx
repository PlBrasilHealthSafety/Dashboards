import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DashboardFiltersProps {
  selectedYear: number
  onYearChange: (year: number) => void
  selectedMonth: string
  onMonthChange: (month: string) => void
  showMonthFilter?: boolean
  showYearFilter?: boolean
}

const months = [
  { value: 'all', label: 'Todos os Meses' },
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' }
]

const years = [2021, 2022, 2023, 2024, 2025]

export function DashboardFilters({
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  showMonthFilter = true,
  showYearFilter = true
}: DashboardFiltersProps) {
  return (
    <Card className="mb-6 shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/50">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {showYearFilter && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Ano:</span>
              <div className="flex gap-1">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => onYearChange(year)}
                    className="text-xs"
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {showMonthFilter && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Mês:</span>
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
