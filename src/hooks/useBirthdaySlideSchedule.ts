import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const BIRTHDAY_SLIDE_ID = 'aniversariantes'

export type BirthdaySlideSlotId = 'daily'

type BirthdaySlideTimeSource = 'server' | 'local'

interface MarkBirthdaySlideOptions {
  slotId?: BirthdaySlideSlotId | null
  updateState?: boolean
}

const CLOCK_TICK_INTERVAL_MS = 60000
const SERVER_TIME_SYNC_INTERVAL_MS = 5 * 60000
const SERVER_TIME_REQUEST_TIMEOUT_MS = 4000

const BIRTHDAY_SLIDE_WINDOW = {
  slotId: 'daily' as const,
  startHour: 10,
  startMinute: 0,
  endHour: 10,
  endMinute: 30,
}

const minutesSinceMidnight = (date: Date) => date.getHours() * 60 + date.getMinutes()

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

const isInsideBirthdaySlideWindow = (date: Date) => {
  const currentMinute = minutesSinceMidnight(date)
  const startMinute = BIRTHDAY_SLIDE_WINDOW.startHour * 60 + BIRTHDAY_SLIDE_WINDOW.startMinute
  const endMinute = BIRTHDAY_SLIDE_WINDOW.endHour * 60 + BIRTHDAY_SLIDE_WINDOW.endMinute

  return currentMinute >= startMinute && currentMinute < endMinute
}

export function useBirthdaySlideSchedule() {
  const [now, setNow] = useState(() => new Date())
  const [hasShownInCurrentWindow, setHasShownInCurrentWindow] = useState(false)
  const [timeSource, setTimeSource] = useState<BirthdaySlideTimeSource>('local')
  const [isTimeReady, setIsTimeReady] = useState(false)
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

  const isInsideWindow = useMemo(() => isInsideBirthdaySlideWindow(now), [now])
  const shouldShowBirthdaySlide = isTimeReady && isInsideWindow && !hasShownInCurrentWindow

  useEffect(() => {
    if (!isInsideWindow && hasShownInCurrentWindow) {
      setHasShownInCurrentWindow(false)
    }
  }, [hasShownInCurrentWindow, isInsideWindow])

  return {
    currentBirthdaySlideSlot: shouldShowBirthdaySlide ? BIRTHDAY_SLIDE_WINDOW.slotId : null,
    isUsingServerTime: timeSource === 'server',
    birthdaySlideTimeSource: timeSource,
    shouldShowBirthdaySlide,
    markBirthdaySlideShown: (options?: MarkBirthdaySlideOptions) => {
      if (options?.updateState === false) {
        return
      }

      setHasShownInCurrentWindow(true)
    },
  }
}