import type { Contrato } from '@/lib/types'

/**
 * Contratos pendentes há mais de 30 min são considerados obsoletos.
 * Na abertura do Modo TV eles são marcados como exibidos no Firestore.
 */
export const TV_CONTRATO_MAX_PENDING_AGE_MS = 30 * 60 * 1000

export const readContratoCreatedAt = (value: Contrato['createdAt']): number | null => {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === 'object' && 'toMillis' in value && typeof value.toMillis === 'function') {
    return value.toMillis()
  }

  return null
}

export const isContratoCreatedAfter = (contrato: Contrato, sessionStartedAtMs: number) => {
  const createdAt = readContratoCreatedAt(contrato.createdAt)
  if (createdAt === null) {
    return false
  }

  return createdAt >= sessionStartedAtMs
}

export const isContratoTooOldToDisplay = (contrato: Contrato, now = Date.now()) => {
  const createdAt = readContratoCreatedAt(contrato.createdAt)
  if (createdAt === null) {
    return true
  }

  return now - createdAt > TV_CONTRATO_MAX_PENDING_AGE_MS
}
