import { describe, expect, it } from 'vitest'
import {
  computeSlideStallThresholdMs,
  isSlideStalled,
  readSlideDurationMs,
  shouldRunNightlyTvReload,
} from '@/lib/tv-kiosk-shield'

describe('tv-kiosk-shield', () => {
  it('calcula limite de travamento com base na duracao do slide', () => {
    expect(computeSlideStallThresholdMs({ id: 1, content: null, duration: 30000 })).toBe(90000)
    expect(computeSlideStallThresholdMs({ id: 'looker', content: null, duration: 240000 })).toBe(615000)
  })

  it('detecta slide parado alem do esperado', () => {
    const item = { id: 1, content: null, duration: 30000 }
    expect(isSlideStalled(89999, item)).toBe(false)
    expect(isSlideStalled(90000, item)).toBe(true)
  })

  it('usa duracao padrao quando slide nao informa tempo', () => {
    expect(readSlideDurationMs({ id: 1, content: null })).toBe(30000)
  })

  it('reload noturno apenas uma vez por dia na janela das 3h', () => {
    const inWindow = new Date('2026-06-12T03:02:00')
    const result = shouldRunNightlyTvReload(inWindow, null)
    expect(result.shouldReload).toBe(true)
    expect(result.dateKey).toBe('2026-06-12')

    const alreadyReloaded = shouldRunNightlyTvReload(inWindow, '2026-06-12')
    expect(alreadyReloaded.shouldReload).toBe(false)

    const outsideWindow = new Date('2026-06-12T10:00:00')
    expect(shouldRunNightlyTvReload(outsideWindow, null).shouldReload).toBe(false)
  })
})
