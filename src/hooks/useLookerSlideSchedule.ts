import { useCallback, useEffect, useState } from 'react'
import type { BusinessClockSnapshot } from '@/lib/business-clock'
import {
  FIRST_LOOKER_DASHBOARD_ID,
  LAST_LOOKER_DASHBOARD_ID,
  readLookerCycleWindow,
  type LookerCycleSlotId,
} from '@/lib/looker-schedule'

import { readScopedTvStorage, writeScopedTvStorage } from '@/lib/tv-station'

const LOOKER_CYCLE_STORAGE_KEY = 'plbrasil:looker-cycle-history'

interface LookerCycleHistory {
  dateKey: string
  morningCycles: number
  afternoonCycles: number
}

const createEmptyLookerCycleHistory = (dateKey: string): LookerCycleHistory => ({
  dateKey,
  morningCycles: 0,
  afternoonCycles: 0,
})

const readLookerCycleHistory = (dateKey: string) => {
  try {
    const raw = readScopedTvStorage(LOOKER_CYCLE_STORAGE_KEY)
    if (!raw) {
      return createEmptyLookerCycleHistory(dateKey)
    }

    const parsed = JSON.parse(raw) as Partial<LookerCycleHistory>
    if (parsed.dateKey !== dateKey) {
      return createEmptyLookerCycleHistory(dateKey)
    }

    return {
      dateKey,
      morningCycles: typeof parsed.morningCycles === 'number' ? parsed.morningCycles : 0,
      afternoonCycles: typeof parsed.afternoonCycles === 'number' ? parsed.afternoonCycles : 0,
    }
  } catch {
    return createEmptyLookerCycleHistory(dateKey)
  }
}

const writeLookerCycleHistory = (history: LookerCycleHistory) => {
  try {
    writeScopedTvStorage(LOOKER_CYCLE_STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.warn('Nao foi possivel salvar o historico de ciclos Looker.', error)
  }
}

const readCyclesShownForSlot = (history: LookerCycleHistory, slotId: LookerCycleSlotId) => {
  return slotId === 'morning' ? history.morningCycles : history.afternoonCycles
}

interface UseLookerSlideScheduleOptions {
  clockSnapshot: BusinessClockSnapshot
  isTimeReady: boolean
}

export function useLookerSlideSchedule({ clockSnapshot, isTimeReady }: UseLookerSlideScheduleOptions) {
  const [cycleHistory, setCycleHistory] = useState(() => readLookerCycleHistory(clockSnapshot.dateKey))
  const [isLookerCycleActive, setIsLookerCycleActive] = useState(false)
  const [activeLookerSlideIds, setActiveLookerSlideIds] = useState<Set<string>>(new Set())
  const [activeCycleSlotId, setActiveCycleSlotId] = useState<LookerCycleSlotId | null>(null)

  const currentWindow = readLookerCycleWindow(clockSnapshot.minutesFromStartOfDay)
  const cyclesShownInCurrentWindow = currentWindow
    ? readCyclesShownForSlot(cycleHistory, currentWindow.slotId)
    : 0
  const canStartNewLookerCycle = Boolean(
    isTimeReady &&
    currentWindow &&
    cyclesShownInCurrentWindow < currentWindow.maxCycles
  )

  const shouldShowLookerSlides = Boolean(
    currentWindow &&
    (isLookerCycleActive || activeLookerSlideIds.size > 0 || canStartNewLookerCycle),
  )

  useEffect(() => {
    if (currentWindow) {
      return
    }

    if (isLookerCycleActive) {
      setIsLookerCycleActive(false)
      setActiveCycleSlotId(null)
    }

    if (activeLookerSlideIds.size > 0) {
      setActiveLookerSlideIds(new Set())
    }
  }, [activeLookerSlideIds.size, currentWindow, isLookerCycleActive])

  useEffect(() => {
    if (!currentWindow || isLookerCycleActive || activeLookerSlideIds.size > 0 || canStartNewLookerCycle) {
      return
    }

    setActiveCycleSlotId(null)
  }, [activeLookerSlideIds.size, canStartNewLookerCycle, currentWindow, isLookerCycleActive])

  useEffect(() => {
    setCycleHistory(readLookerCycleHistory(clockSnapshot.dateKey))
  }, [clockSnapshot.dateKey])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (!event.key?.startsWith(LOOKER_CYCLE_STORAGE_KEY)) {
        return
      }

      setCycleHistory(readLookerCycleHistory(clockSnapshot.dateKey))
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [clockSnapshot.dateKey])

  const incrementCycleCount = useCallback((slotId: LookerCycleSlotId) => {
    setCycleHistory((currentHistory) => {
      const baseHistory =
        currentHistory.dateKey === clockSnapshot.dateKey
          ? currentHistory
          : createEmptyLookerCycleHistory(clockSnapshot.dateKey)

      const nextHistory = {
        dateKey: clockSnapshot.dateKey,
        morningCycles: slotId === 'morning' ? baseHistory.morningCycles + 1 : baseHistory.morningCycles,
        afternoonCycles: slotId === 'afternoon' ? baseHistory.afternoonCycles + 1 : baseHistory.afternoonCycles,
      }

      writeLookerCycleHistory(nextHistory)
      return nextHistory
    })
  }, [clockSnapshot.dateKey])

  const handleLookerSlideEnter = useCallback((dashboardId: string) => {
    setActiveLookerSlideIds((currentIds) => new Set(currentIds).add(dashboardId))

    if (dashboardId !== FIRST_LOOKER_DASHBOARD_ID) {
      return
    }

    const windowForCycle = readLookerCycleWindow(clockSnapshot.minutesFromStartOfDay) ?? (
      activeCycleSlotId
        ? { slotId: activeCycleSlotId, startMinute: 0, endMinute: 0, maxCycles: 3 }
        : null
    )

    if (!windowForCycle) {
      return
    }

    const cyclesShown = readCyclesShownForSlot(cycleHistory, windowForCycle.slotId)
    if (cyclesShown >= windowForCycle.maxCycles && !isLookerCycleActive) {
      return
    }

    setActiveCycleSlotId(windowForCycle.slotId)
    setIsLookerCycleActive(true)
  }, [activeCycleSlotId, clockSnapshot.minutesFromStartOfDay, cycleHistory, isLookerCycleActive])

  const handleLookerSlideExit = useCallback((dashboardId: string) => {
    setActiveLookerSlideIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.delete(dashboardId)
      return nextIds
    })

    if (dashboardId !== LAST_LOOKER_DASHBOARD_ID) {
      return
    }

    const slotId = activeCycleSlotId ?? readLookerCycleWindow(clockSnapshot.minutesFromStartOfDay)?.slotId
    if (slotId) {
      incrementCycleCount(slotId)
    }

    setIsLookerCycleActive(false)
    setActiveCycleSlotId(null)
  }, [activeCycleSlotId, clockSnapshot.minutesFromStartOfDay, incrementCycleCount])

  return {
    shouldShowLookerSlides,
    canStartNewLookerCycle,
    cyclesShownInCurrentWindow,
    currentLookerWindow: currentWindow,
    isLookerCycleActive,
    handleLookerSlideEnter,
    handleLookerSlideExit,
  }
}
