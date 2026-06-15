import { describe, expect, it } from 'vitest'
import {
  buildTvHardReloadUrl,
  isDuplicateTvSessionMessage,
  isTvDashboardPath,
  shouldReloadDiscardedTvTab,
} from '@/lib/tv-session-shield'

describe('tv-session-shield', () => {
  it('identifica rota da TV', () => {
    expect(isTvDashboardPath('/tv-dashboard')).toBe(true)
    expect(isTvDashboardPath('/tv-dashboard?tv=sala-a')).toBe(true)
    expect(isTvDashboardPath('/home')).toBe(false)
  })

  it('monta URL de reload com motivo', () => {
    const url = buildTvHardReloadUrl('https://app.example/tv-dashboard?tv=a', 'pageshow')
    expect(url).toContain('_tv=')
    expect(url).toContain('_r=pageshow')
  })

  it('detecta mensagem de aba duplicada na mesma estacao', () => {
    const message = {
      type: 'hello' as const,
      stationId: 'sala-a',
      tabId: 'tab-2',
      at: Date.now(),
    }

    expect(isDuplicateTvSessionMessage(message, 'sala-a', 'tab-1')).toBe(true)
    expect(isDuplicateTvSessionMessage(message, 'sala-b', 'tab-1')).toBe(false)
    expect(isDuplicateTvSessionMessage(message, 'sala-a', 'tab-2')).toBe(false)
  })

  it('recarrega aba descartada pelo navegador na rota TV', () => {
    expect(shouldReloadDiscardedTvTab(true, '/tv-dashboard')).toBe(true)
    expect(shouldReloadDiscardedTvTab(false, '/tv-dashboard')).toBe(false)
  })
})
