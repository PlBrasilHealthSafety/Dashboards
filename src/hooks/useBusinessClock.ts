import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CLOCK_TICK_INTERVAL_MS,
  readBusinessClockSnapshot,
  readServerDateHeader,
  SERVER_TIME_REQUEST_TIMEOUT_MS,
  SERVER_TIME_SYNC_INTERVAL_MS,
  type BusinessClockTimeSource,
} from '@/lib/business-clock'

type BrowserTimeoutHandle = number

export function useBusinessClock() {
  const [now, setNow] = useState(() => new Date())
  const [timeSource, setTimeSource] = useState<BusinessClockTimeSource>('local')
  const [isTimeReady, setIsTimeReady] = useState(false)
  const serverTimeOffsetRef = useRef<number | null>(null)

  const readEffectiveNow = useCallback(() => {
    const offset = serverTimeOffsetRef.current ?? 0
    return new Date(Date.now() + offset)
  }, [])

  const syncTimeWithServer = useCallback(async () => {
    const abortController = new AbortController()
    const timeoutId: BrowserTimeoutHandle = window.setTimeout(() => abortController.abort(), SERVER_TIME_REQUEST_TIMEOUT_MS)

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
        console.warn('Nao foi possivel sincronizar o horario com o servidor. Usando horario local.', error)
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

  const clockSnapshot = useMemo(() => readBusinessClockSnapshot(now), [now])

  return {
    now,
    clockSnapshot,
    timeSource,
    isTimeReady,
    isUsingServerTime: timeSource === 'server',
  }
}
