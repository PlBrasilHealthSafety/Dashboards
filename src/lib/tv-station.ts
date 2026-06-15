/**
 * Identidade da estação TV para isolar localStorage (ciclos Looker / aniversário).
 *
 * Uso padrão (uma TV): abra apenas `/tv-dashboard` — sem parâmetros na URL.
 * Várias TVs na mesma rede: use `?tv=sala-a`, `?tv=sala-b`, etc.
 */

const TV_STATION_QUERY_PARAM = 'tv'
const TV_STATION_STORAGE_KEY = 'plbrasil:tv-station-id'
export const DEFAULT_TV_STATION_ID = 'principal'

const SCOPED_STORAGE_BASE_KEYS = [
  'plbrasil:looker-cycle-history',
  'plbrasil:birthday-slide-shown-date',
] as const

export const hasExplicitTvStationParam = (): boolean => {
  const fromUrl = new URLSearchParams(window.location.search).get(TV_STATION_QUERY_PARAM)?.trim()
  return Boolean(fromUrl)
}

const migrateStationStorageToDefault = (previousStationId: string) => {
  if (previousStationId === DEFAULT_TV_STATION_ID) {
    return
  }

  try {
    for (const baseKey of SCOPED_STORAGE_BASE_KEYS) {
      const previousScopedKey = `${baseKey}:${previousStationId}`
      const defaultScopedKey = `${baseKey}:${DEFAULT_TV_STATION_ID}`
      const previousValue = localStorage.getItem(previousScopedKey)

      if (previousValue !== null && localStorage.getItem(defaultScopedKey) === null) {
        localStorage.setItem(defaultScopedKey, previousValue)
      }
    }
  } catch {
    // ignora
  }
}

export const getTvStationId = (): string => {
  const fromUrl = new URLSearchParams(window.location.search).get(TV_STATION_QUERY_PARAM)?.trim()
  if (fromUrl) {
    try {
      localStorage.setItem(TV_STATION_STORAGE_KEY, fromUrl)
    } catch {
      // localStorage indisponível — segue com o id da URL
    }
    return fromUrl
  }

  try {
    const stored = localStorage.getItem(TV_STATION_STORAGE_KEY)
    if (stored && stored !== DEFAULT_TV_STATION_ID) {
      migrateStationStorageToDefault(stored)
    }
    localStorage.setItem(TV_STATION_STORAGE_KEY, DEFAULT_TV_STATION_ID)
  } catch {
    // ignora
  }

  return DEFAULT_TV_STATION_ID
}

export const scopeStorageKeyForTv = (baseKey: string): string => {
  return `${baseKey}:${getTvStationId()}`
}

/** Lê valor com fallback na chave legada (sem sufixo de estação). */
export const readScopedTvStorage = (baseKey: string): string | null => {
  const scopedKey = scopeStorageKeyForTv(baseKey)

  try {
    const scopedValue = localStorage.getItem(scopedKey)
    if (scopedValue !== null) {
      return scopedValue
    }

    const legacyValue = localStorage.getItem(baseKey)
    if (legacyValue !== null) {
      localStorage.setItem(scopedKey, legacyValue)
      return legacyValue
    }
  } catch {
    return null
  }

  return null
}

export const writeScopedTvStorage = (baseKey: string, value: string): void => {
  try {
    localStorage.setItem(scopeStorageKeyForTv(baseKey), value)
  } catch (error) {
    console.warn(`Nao foi possivel salvar ${baseKey} para a estacao TV.`, error)
  }
}
