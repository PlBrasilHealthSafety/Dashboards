import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const BIRTHDAY_SLIDE_ID = 'aniversariantes'

export type BirthdaySlideSlotId = 'daily'

type BirthdaySlideTimeSource = 'server' | 'local'

interface BusinessClockSnapshot {
  dateKey: string
}

interface MarkBirthdaySlideOptions {
  slotId?: BirthdaySlideSlotId | null
  updateState?: boolean
}

const CLOCK_TICK_INTERVAL_MS = 60000
const SERVER_TIME_SYNC_INTERVAL_MS = 5 * 60000
const SERVER_TIME_REQUEST_TIMEOUT_MS = 4000
const BIRTHDAY_SLIDE_STORAGE_KEY = 'plbrasil:birthday-slide-shown-date'
const BUSINESS_TIME_ZONE = 'America/Sao_Paulo'

const BIRTHDAY_SLIDE_WINDOW = {
  slotId: 'daily' as const,
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

const readBusinessClockSnapshot = (date: Date): BusinessClockSnapshot => {
  const parts = businessClockFormatter.formatToParts(date)

  const year = parts.find((part) => part.type === 'year')?.value ?? '0000'
  const month = parts.find((part) => part.type === 'month')?.value ?? '01'
  const day = parts.find((part) => part.type === 'day')?.value ?? '01'

  return {
    dateKey: `${year}-${month}-${day}`,
  }
}

const readLastShownDate = () => {
  try {
    return window.localStorage.getItem(BIRTHDAY_SLIDE_STORAGE_KEY)
  } catch (error) {
    console.warn('Nao foi possivel ler o registro local do slide de aniversariantes.', error)
    return null
  }
}

const writeLastShownDate = (dateKey: string) => {
  try {
    window.localStorage.setItem(BIRTHDAY_SLIDE_STORAGE_KEY, dateKey)
  } catch (error) {
    console.warn('Nao foi possivel salvar o registro local do slide de aniversariantes.', error)
  }
}

const readServerDateHeader = async (signal: AbortSignal) => {
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

export function useBirthdaySlideSchedule() {
  const [now, setNow] = useState(() => new Date())
  const [lastShownDate, setLastShownDate] = useState(() => readLastShownDate())
  const [timeSource, setTimeSource] = useState<BirthdaySlideTimeSource>('local')
  const [isTimeReady, setIsTimeReady] = useState(false)
  const [isBirthdaySlidePresentationInProgress, setIsBirthdaySlidePresentationInProgress] = useState(false)
  const serverTimeOffsetRef = useRef<number | null>(null)

  const readEffectiveNow = useCallback(() => {
    const offset = serverTimeOffsetRef.current ?? 0
    return new Date(Date.now() + offset)
  }, [])

  const syncTimeWithServer = useCallback(async () => {
    const abortController = new AbortController()
    const timeoutId = window.setTimeout(() => abortController.abort(), SERVER_TIME_REQUEST_TIMEOUT_MS)

    try {
      const serverDate = await readServerDateHeader(abortController.signal)

      if (serverDate) {
        serverTimeOffsetRef.current = serverDate.getTime() - Date.now()
        setTimeSource('server')
        setNow(readEffectiveNow())
      } else if (serverTimeOffsetRef.current === null) {
        setTimeSource('local')
        setNow(new Date())
      }
    } catch (error) {
      if (serverTimeOffsetRef.current === null) {
        console.warn('Nao foi possivel sincronizar o horario com o servidor. Usando horario local da TV.', error)
        setTimeSource('local')
        setNow(new Date())
      }
    } finally {
      window.clearTimeout(timeoutId)
      setIsTimeReady(true)
    }
  }, [readEffectiveNow])

  useEffect(() => {
    void syncTimeWithServer()

    const clockIntervalId = window.setInterval(() => {
      setNow(readEffectiveNow())
    }, CLOCK_TICK_INTERVAL_MS)

    const syncIntervalId = window.setInterval(() => {
      void syncTimeWithServer()
    }, SERVER_TIME_SYNC_INTERVAL_MS)

    return () => {
      window.clearInterval(clockIntervalId)
      window.clearInterval(syncIntervalId)
    }
  }, [readEffectiveNow, syncTimeWithServer])

  const currentClockSnapshot = useMemo(() => readBusinessClockSnapshot(now), [now])
  const currentDateKey = currentClockSnapshot.dateKey
  const hasShownToday = lastShownDate === currentDateKey
  const shouldShowBirthdaySlide = isBirthdaySlidePresentationInProgress || (isTimeReady && !hasShownToday)

  useEffect(() => {
    const storedShownDate = readLastShownDate()

    if (storedShownDate !== lastShownDate) {
      setLastShownDate(storedShownDate)
    }
  }, [currentDateKey, lastShownDate])

  return {
    currentBirthdaySlideSlot: shouldShowBirthdaySlide ? BIRTHDAY_SLIDE_WINDOW.slotId : null,
    isUsingServerTime: timeSource === 'server',
    birthdaySlideTimeSource: timeSource,
    shouldShowBirthdaySlide,
    markBirthdaySlideShown: (options?: MarkBirthdaySlideOptions) => {
      writeLastShownDate(currentDateKey)
      setLastShownDate(currentDateKey)

      if (options?.updateState === false) {
        setIsBirthdaySlidePresentationInProgress(true)
        return
      }

      setIsBirthdaySlidePresentationInProgress(false)
    },
  }
}