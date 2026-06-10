export interface SlideDisplayWindow {
  /** Minutos desde meia-noite no fuso America/Sao_Paulo (ex.: 10h = 600) */
  startMinute: number
  endMinute: number
}

export const createDisplayWindow = (startHour: number, startMin: number, endHour: number, endMin: number): SlideDisplayWindow => ({
  startMinute: startHour * 60 + startMin,
  endMinute: endHour * 60 + endMin,
})

export const isWithinDisplayWindows = (
  minutesFromStartOfDay: number,
  windows: SlideDisplayWindow[] | undefined
) => {
  if (!windows || windows.length === 0) {
    return true
  }

  return windows.some((window) => {
    return minutesFromStartOfDay >= window.startMinute && minutesFromStartOfDay < window.endMinute
  })
}
