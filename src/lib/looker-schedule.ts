import { createDisplayWindow } from '@/lib/slide-schedule'

export type LookerCycleSlotId = 'morning' | 'afternoon'

export interface LookerCycleWindow {
  slotId: LookerCycleSlotId
  startMinute: number
  endMinute: number
  maxCycles: number
}

/** Primeiro e último painel Looker na ordem do carrossel da TV (define um ciclo completo). */
export const FIRST_LOOKER_DASHBOARD_ID = 'medicina-convocacao'
export const LAST_LOOKER_DASHBOARD_ID = 'medicina-asos'

export const LOOKER_CYCLE_WINDOWS: LookerCycleWindow[] = [
  {
    slotId: 'morning',
    startMinute: createDisplayWindow(8, 0, 10, 0).startMinute,
    endMinute: createDisplayWindow(8, 0, 10, 0).endMinute,
    // 5 ciclos × ~24 min ≈ 120 min — preenche a janela de 8h–10h (≥ 110 min de conteúdo)
    maxCycles: 5,
  },
  {
    slotId: 'afternoon',
    startMinute: createDisplayWindow(14, 0, 17, 0).startMinute,
    endMinute: createDisplayWindow(14, 0, 17, 0).endMinute,
    // 7 ciclos × ~24 min ≈ 168 min — usa boa parte das 3h (14h–17h), com folga até 17h
    maxCycles: 7,
  },
]

export const readLookerCycleWindow = (minutesFromStartOfDay: number) => {
  return LOOKER_CYCLE_WINDOWS.find((window) => {
    return minutesFromStartOfDay >= window.startMinute && minutesFromStartOfDay < window.endMinute
  })
}

/** Estimativa de duração de um ciclo completo (5 Looker + 8 PPT), sem aniversariantes. */
export const estimateLookerCycleDurationMs = (
  lookerSlideDurationMs: number,
  pptSlideDurationMs = 30000
) => {
  const lookerSlides = 5
  const pptSlides = 8
  return lookerSlides * lookerSlideDurationMs + pptSlides * pptSlideDurationMs
}
