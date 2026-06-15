import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getTvStationId,
  readScopedTvStorage,
  scopeStorageKeyForTv,
  writeScopedTvStorage,
} from '@/lib/tv-station'

describe('tv-station', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('usa o parametro tv da URL como id da estacao', () => {
    vi.stubGlobal('location', {
      ...window.location,
      search: '?tv=recepcao-a',
    })

    expect(getTvStationId()).toBe('recepcao-a')
    expect(scopeStorageKeyForTv('plbrasil:test')).toBe('plbrasil:test:recepcao-a')
  })

  it('gera ids diferentes para estacoes sem parametro tv', () => {
    vi.stubGlobal('location', {
      ...window.location,
      search: '',
    })

    const first = getTvStationId()
    localStorage.clear()

    const second = getTvStationId()
    expect(first).not.toBe(second)
  })

  it('migra valor legado para chave com escopo da estacao', () => {
    vi.stubGlobal('location', {
      ...window.location,
      search: '?tv=sala-b',
    })

    localStorage.setItem('plbrasil:looker-cycle-history', '{"dateKey":"2026-06-12"}')
    const value = readScopedTvStorage('plbrasil:looker-cycle-history')

    expect(value).toBe('{"dateKey":"2026-06-12"}')
    expect(localStorage.getItem('plbrasil:looker-cycle-history:sala-b')).toBe(value)
  })

  it('grava e le na chave com escopo', () => {
    vi.stubGlobal('location', {
      ...window.location,
      search: '?tv=sala-c',
    })

    writeScopedTvStorage('plbrasil:birthday', '{"ok":true}')
    expect(readScopedTvStorage('plbrasil:birthday')).toBe('{"ok":true}')
  })
})
