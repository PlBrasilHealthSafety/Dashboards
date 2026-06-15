import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_TV_STATION_ID,
  getTvStationId,
  hasExplicitTvStationParam,
  readScopedTvStorage,
  scopeStorageKeyForTv,
  writeScopedTvStorage,
} from '@/lib/tv-station'

describe('tv-station', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('usa id fixo principal quando nao ha parametro tv na URL', () => {
    vi.stubGlobal('location', {
      ...window.location,
      search: '',
    })

    expect(hasExplicitTvStationParam()).toBe(false)
    expect(getTvStationId()).toBe(DEFAULT_TV_STATION_ID)
    expect(getTvStationId()).toBe(DEFAULT_TV_STATION_ID)
    expect(scopeStorageKeyForTv('plbrasil:test')).toBe(`plbrasil:test:${DEFAULT_TV_STATION_ID}`)
  })

  it('usa o parametro tv da URL quando informado (multiplas TVs)', () => {
    vi.stubGlobal('location', {
      ...window.location,
      search: '?tv=recepcao-a',
    })

    expect(hasExplicitTvStationParam()).toBe(true)
    expect(getTvStationId()).toBe('recepcao-a')
    expect(scopeStorageKeyForTv('plbrasil:test')).toBe('plbrasil:test:recepcao-a')
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

  it('migra historico de id aleatorio anterior para principal', () => {
    vi.stubGlobal('location', {
      ...window.location,
      search: '',
    })

    localStorage.setItem('plbrasil:tv-station-id', 'tv-antigo-uuid')
    localStorage.setItem('plbrasil:looker-cycle-history:tv-antigo-uuid', '{"dateKey":"2026-06-12"}')

    expect(getTvStationId()).toBe(DEFAULT_TV_STATION_ID)
    expect(readScopedTvStorage('plbrasil:looker-cycle-history')).toBe('{"dateKey":"2026-06-12"}')
  })

  it('grava e le na chave com escopo', () => {
    vi.stubGlobal('location', {
      ...window.location,
      search: '',
    })

    writeScopedTvStorage('plbrasil:birthday', '{"ok":true}')
    expect(readScopedTvStorage('plbrasil:birthday')).toBe('{"ok":true}')
  })
})
