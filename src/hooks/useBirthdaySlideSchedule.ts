import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const BIRTHDAY_SLIDE_ID = 'aniversariantes'

export type BirthdaySlideSlotId = 'morning' | 'afternoon'

type BirthdaySlideTimeSource = 'server' | 'local'

interface BusinessClockSnapshot {
  dateKey: string
  minutesFromStartOfDay: number
}

interface BirthdaySlideHistory {
  dateKey: string | null
  shownSlotIds: BirthdaySlideSlotId[]
}

type StoredBirthdaySlideHistory = Partial<BirthdaySlideHistory> & {
  count?: number
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

const BIRTHDAY_SLIDE_WINDOWS = [
  {
    slotId: 'morning' as const,
    startMinute: 10 * 60,
    endMinute: 10 * 60 + 30,
  },
  {
    slotId: 'afternoon' as const,
    startMinute: 15 * 60,
    endMinute: 15 * 60 + 30,
  },
]

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
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0')

  return {
    dateKey: `${year}-${month}-${day}`,
    minutesFromStartOfDay: hour * 60 + minute,
  }
}

const createEmptyBirthdaySlideHistory = (): BirthdaySlideHistory => ({
  dateKey: null,
  shownSlotIds: [],
})

const createSlotIdsFromLegacyCount = (count: number): BirthdaySlideSlotId[] => {
  if (count >= 2) {
    return ['morning', 'afternoon']
  }

  if (count === 1) {
    return ['morning']
  }

  return []
}

const parseBirthdaySlideHistory = (storedValue: string | null): BirthdaySlideHistory => {
  if (!storedValue) {
    return createEmptyBirthdaySlideHistory()
  }

  try {
    const parsedValue = JSON.parse(storedValue) as StoredBirthdaySlideHistory

    if (typeof parsedValue.dateKey === 'string') {
      return {
        dateKey: parsedValue.dateKey,
        shownSlotIds: Array.isArray(parsedValue.shownSlotIds)
          ? parsedValue.shownSlotIds.filter((slotId): slotId is BirthdaySlideSlotId => {
              return slotId === 'morning' || slotId === 'afternoon'
            })
          : createSlotIdsFromLegacyCount(typeof parsedValue.count === 'number' ? parsedValue.count : 0),
      }
    }
  } catch {
    return {
      dateKey: storedValue,
      shownSlotIds: ['morning'],
    }
  }

  return createEmptyBirthdaySlideHistory()
}

const readBirthdaySlideHistory = () => {
  try {
    return parseBirthdaySlideHistory(window.localStorage.getItem(BIRTHDAY_SLIDE_STORAGE_KEY))
  } catch (error) {
    console.warn('Nao foi possivel ler o registro local do slide de aniversariantes.', error)
    return createEmptyBirthdaySlideHistory()
  }
}

const writeBirthdaySlideHistory = (history: BirthdaySlideHistory) => {
  try {
    window.localStorage.setItem(BIRTHDAY_SLIDE_STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.warn('Nao foi possivel salvar o registro local do slide de aniversariantes.', error)
  }
}

const areBirthdaySlideHistoriesEqual = (left: BirthdaySlideHistory, right: BirthdaySlideHistory) => {
  return left.dateKey === right.dateKey && left.shownSlotIds.join('|') === right.shownSlotIds.join('|')
}

const readBirthdaySlideWindow = (minutesFromStartOfDay: number) => {
  return BIRTHDAY_SLIDE_WINDOWS.find((window) => {
    return minutesFromStartOfDay >= window.startMinute && minutesFromStartOfDay < window.endMinute
  })
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
  const [birthdaySlideHistory, setBirthdaySlideHistory] = useState(() => readBirthdaySlideHistory())
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
  const currentBirthdaySlideWindow = readBirthdaySlideWindow(currentClockSnapshot.minutesFromStartOfDay)
  const shownSlotIdsToday = birthdaySlideHistory.dateKey === currentDateKey ? birthdaySlideHistory.shownSlotIds : []
  const hasShownCurrentSlot = currentBirthdaySlideWindow
    ? shownSlotIdsToday.includes(currentBirthdaySlideWindow.slotId)
    : true
  const shouldShowBirthdaySlide = isBirthdaySlidePresentationInProgress || (isTimeReady && !hasShownCurrentSlot)

  useEffect(() => {
    const storedHistory = readBirthdaySlideHistory()

    if (!areBirthdaySlideHistoriesEqual(storedHistory, birthdaySlideHistory)) {
      setBirthdaySlideHistory(storedHistory)
    }
  }, [currentDateKey, birthdaySlideHistory])

  const markBirthdaySlidePresentationStarted = () => {
    if (!currentBirthdaySlideWindow) {
      return
    }

    const nextHistory = {
      dateKey: currentDateKey,
      shownSlotIds: Array.from(new Set([...shownSlotIdsToday, currentBirthdaySlideWindow.slotId])),
    }

    writeBirthdaySlideHistory(nextHistory)
    setBirthdaySlideHistory(nextHistory)
    setIsBirthdaySlidePresentationInProgress(true)
  }

  return {
    currentBirthdaySlideSlot: shouldShowBirthdaySlide ? currentBirthdaySlideWindow?.slotId ?? null : null,
    isUsingServerTime: timeSource === 'server',
    birthdaySlideTimeSource: timeSource,
    shouldShowBirthdaySlide,
    markBirthdaySlideShown: (options?: MarkBirthdaySlideOptions) => {
      if (options?.updateState === false) {
        markBirthdaySlidePresentationStarted()
        return
      }

      setIsBirthdaySlidePresentationInProgress(false)
    },
  }
}