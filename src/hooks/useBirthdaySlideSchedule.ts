import { useCallback, useEffect, useState } from 'react'
import { useBusinessClock } from '@/hooks/useBusinessClock'

export const BIRTHDAY_SLIDE_ID = 'aniversariantes'

export type BirthdaySlideSlotId = 'morning' | 'afternoon'

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

const BIRTHDAY_SLIDE_STORAGE_KEY = 'plbrasil:birthday-slide-shown-date'

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

export function useBirthdaySlideSchedule() {
  const { clockSnapshot, isTimeReady, isUsingServerTime, timeSource } = useBusinessClock()
  const [birthdaySlideHistory, setBirthdaySlideHistory] = useState(() => readBirthdaySlideHistory())
  const [isBirthdaySlidePresentationInProgress, setIsBirthdaySlidePresentationInProgress] = useState(false)

  const currentDateKey = clockSnapshot.dateKey
  const currentBirthdaySlideWindow = readBirthdaySlideWindow(clockSnapshot.minutesFromStartOfDay)
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

  const markBirthdaySlidePresentationStarted = useCallback(() => {
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
  }, [currentBirthdaySlideWindow, currentDateKey, shownSlotIdsToday])

  return {
    clockSnapshot,
    isTimeReady,
    currentBirthdaySlideSlot: shouldShowBirthdaySlide ? currentBirthdaySlideWindow?.slotId ?? null : null,
    isUsingServerTime,
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
