import {
  isRenderableCarouselItem,
  type CarouselPointerItem,
  type CarouselPointerValidation,
} from '@/lib/carousel-pointer'
import { TV_PPT_LAYOUT_INDICES } from '@/lib/tv-carousel-pointer-model'

export type TvCarouselRenderableItem = CarouselPointerItem & { content?: unknown }

export const TV_PPT_FALLBACK_INDICES = TV_PPT_LAYOUT_INDICES

const sortIndices = (indices: number[]) => [...indices].sort((left, right) => left - right)

/** Próximo índice PPT no layout fixo (circular), ignorando slots vazios no meio. */
export const findNextPptLayoutIndex = (
  fromIndex: number,
  pptIndices: number[] = TV_PPT_FALLBACK_INDICES,
): number => {
  const sorted = sortIndices(pptIndices)
  if (sorted.length === 0) {
    return 0
  }

  for (const pptIndex of sorted) {
    if (pptIndex > fromIndex) {
      return pptIndex
    }
  }

  return sorted[0]
}

/** Primeiro PPT renderizável; se nenhum, primeiro índice PPT do layout. */
export const findFirstRenderablePptIndex = (
  items: TvCarouselRenderableItem[],
  pptIndices: number[] = TV_PPT_FALLBACK_INDICES,
): number => {
  const sorted = sortIndices(pptIndices)

  for (const pptIndex of sorted) {
    if (isRenderableCarouselItem(items[pptIndex])) {
      return pptIndex
    }
  }

  return sorted[0] ?? 0
}

/** Próximo PPT renderizável após fromIndex (circular entre os 8 PPTs). */
export const findNextRenderablePptIndex = (
  items: TvCarouselRenderableItem[],
  fromIndex: number,
  pptIndices: number[] = TV_PPT_FALLBACK_INDICES,
): number => {
  const sorted = sortIndices(pptIndices)
  if (sorted.length === 0) {
    return 0
  }

  let walkFrom = fromIndex
  for (let step = 0; step < sorted.length; step += 1) {
    const pptIndex = findNextPptLayoutIndex(walkFrom, sorted)
    if (isRenderableCarouselItem(items[pptIndex])) {
      return pptIndex
    }
    walkFrom = pptIndex
  }

  return findFirstRenderablePptIndex(items, sorted)
}

/**
 * Garantia da TV: nó vazio, autoSkip ou sem conteúdo → salta direto para um dos 8 PPTs.
 * Nunca devolve índice Looker/aniversário vazio.
 */
export const resolveTvPptFallbackIndex = (
  items: TvCarouselRenderableItem[],
  fromIndex: number,
  pptIndices: number[] = TV_PPT_FALLBACK_INDICES,
): number => {
  const bounded = items.length === 0
    ? 0
    : Math.min(Math.max(fromIndex, 0), items.length - 1)

  if (isRenderableCarouselItem(items[bounded])) {
    return bounded
  }

  return findNextRenderablePptIndex(items, bounded, pptIndices)
}

export const validateTvCarouselPointer = (
  items: TvCarouselRenderableItem[],
  index: number,
  pptIndices: number[] = TV_PPT_FALLBACK_INDICES,
  isIndexAllowed?: (slideIndex: number) => boolean,
): CarouselPointerValidation => {
  if (items.length === 0) {
    return { valid: false, safeIndex: 0, reason: 'empty' }
  }

  const boundedIndex = Math.min(Math.max(index, 0), items.length - 1)
  const allowed = isIndexAllowed?.(boundedIndex) ?? true
  const candidate = items[boundedIndex]

  if (allowed && isRenderableCarouselItem(candidate)) {
    return { valid: true, safeIndex: boundedIndex }
  }

  return {
    valid: false,
    safeIndex: findNextRenderablePptIndex(items, boundedIndex, pptIndices),
    reason: 'autoSkip',
  }
}

/** Avanço do timer na TV: nunca para em slot bloqueado ou vazio — volta aos PPTs. */
export const findNextTvSlideIndex = (
  items: TvCarouselRenderableItem[],
  fromIndex: number,
  pptIndices: number[] = TV_PPT_FALLBACK_INDICES,
  isIndexAllowed?: (slideIndex: number) => boolean,
): number => {
  if (items.length <= 1) {
    return fromIndex
  }

  let nextIndex = (fromIndex + 1) % items.length
  let steps = 0

  while (steps < items.length) {
    const allowed = isIndexAllowed?.(nextIndex) ?? true
    if (allowed && isRenderableCarouselItem(items[nextIndex])) {
      return nextIndex
    }

    nextIndex = (nextIndex + 1) % items.length
    steps += 1
  }

  return findNextRenderablePptIndex(items, fromIndex, pptIndices)
}

export const resolveTvIndexAfterItemsChange = (
  previousItems: TvCarouselRenderableItem[],
  previousIndex: number,
  nextItems: TvCarouselRenderableItem[],
  pptIndices: number[] = TV_PPT_FALLBACK_INDICES,
  isIndexAllowed?: (slideIndex: number) => boolean,
): number => {
  if (nextItems.length === 0) {
    return 0
  }

  const bounded = Math.min(Math.max(previousIndex, 0), previousItems.length - 1)
  const previousId = previousItems[bounded]?.id

  let remappedIndex = bounded
  if (previousId !== undefined) {
    const sameSlideIndex = nextItems.findIndex((item) => item.id === previousId)
    if (sameSlideIndex >= 0) {
      remappedIndex = sameSlideIndex
    }
  }

  return validateTvCarouselPointer(nextItems, remappedIndex, pptIndices, isIndexAllowed).safeIndex
}

export const isPptLayoutIndex = (
  index: number,
  pptIndices: number[] = TV_PPT_FALLBACK_INDICES,
): boolean => {
  return pptIndices.includes(index)
}
