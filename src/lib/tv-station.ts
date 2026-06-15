/**
 * Identidade da estação TV — evita que duas TVs compartilhem o mesmo
 * localStorage de ciclos Looker / aniversário.
 *
 * Configure cada TV com um ID fixo na URL:
 *   TV 1: /tv-dashboard?tv=sala-a
 *   TV 2: /tv-dashboard?tv=sala-b
 */

const TV_STATION_QUERY_PARAM = 'tv'
const TV_STATION_STORAGE_KEY = 'plbrasil:tv-station-id'

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
    if (stored) {
      return stored
    }
  } catch {
    // ignora
  }

  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `tv-${Date.now()}`

  try {
    localStorage.setItem(TV_STATION_STORAGE_KEY, generated)
  } catch {
    // ignora
  }

  return generated
}

export const scopeStorageKeyForTv = (baseKey: string): string => {
  return `${baseKey}:${getTvStationId()}`
}

/** Lê valor com fallback na chave legada (compartilhada entre TVs). */
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
