export const BUSINESS_TIME_ZONE = 'America/Sao_Paulo'

export const CLOCK_TICK_INTERVAL_MS = 60000
export const SERVER_TIME_SYNC_INTERVAL_MS = 5 * 60000
export const SERVER_TIME_REQUEST_TIMEOUT_MS = 4000

export type BusinessClockTimeSource = 'server' | 'local'

export interface BusinessClockSnapshot {
  dateKey: string
  minutesFromStartOfDay: number
}

const businessClockFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export const readBusinessClockSnapshot = (date: Date): BusinessClockSnapshot => {
  const parts = businessClockFormatter.formatToParts(date)

  const year = parts.find((part) => part.type === 'year')?.value ?? '0000'
  const month = parts.find((part) => part.type === 'month')?.value ?? '01'
  const day = parts.find((part) => part.type === 'day')?.value ?? '01'
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0')

  return {
    dateKey: `${year}-${month}-${day}`,
    minutesFromStartOfDay: hour * 60 + minute,
  }
}

export const readServerDateHeader = async (signal: AbortSignal) => {
  const response = await fetch(window.location.origin, {
    method: 'HEAD',
    cache: 'no-store',
    signal,
  })

  const dateHeader = response.headers.get('date')
  if (!dateHeader) {
    return null
  }

  const serverDate = new Date(dateHeader)
  return Number.isNaN(serverDate.getTime()) ? null : serverDate
}
