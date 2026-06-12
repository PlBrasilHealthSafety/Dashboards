/**
 * Lógica pura de ponteiros do carrossel da TV.
 * Mantida separada para testes exaustivos e recuperação em runtime.
 */

export interface CarouselPointerItem {
  id: string | number
  autoSkip?: boolean
}

export const isPlayableIndex = (items: CarouselPointerItem[], index: number): boolean => {
  if (items.length === 0) {
    return false
  }

  const boundedIndex = Math.min(Math.max(index, 0), items.length - 1)
  return !items[boundedIndex]?.autoSkip
}

export const findNextPlayableIndex = (items: CarouselPointerItem[], fromIndex: number): number => {
  if (items.length === 0) {
    return 0
  }

  if (items.length === 1) {
    return 0
  }

  let nextIndex = (fromIndex + 1) % items.length
  let steps = 0

  while (steps < items.length) {
    if (!items[nextIndex]?.autoSkip) {
      return nextIndex
    }

    nextIndex = (nextIndex + 1) % items.length
    steps += 1
  }

  return fromIndex
}

export const findPreviousPlayableIndex = (items: CarouselPointerItem[], fromIndex: number): number => {
  if (items.length === 0) {
    return 0
  }

  if (items.length === 1) {
    return 0
  }

  let previousIndex = fromIndex === 0 ? items.length - 1 : fromIndex - 1
  let steps = 0

  while (steps < items.length) {
    if (!items[previousIndex]?.autoSkip) {
      return previousIndex
    }

    previousIndex = previousIndex === 0 ? items.length - 1 : previousIndex - 1
    steps += 1
  }

  return fromIndex
}

export const findFirstPlayableIndex = (items: CarouselPointerItem[]): number => {
  if (items.length === 0) {
    return 0
  }

  if (!items[0]?.autoSkip) {
    return 0
  }

  return findNextPlayableIndex(items, 0)
}

export const findRemappedIndex = (
  previousItems: CarouselPointerItem[],
  previousIndex: number,
  nextItems: CarouselPointerItem[],
): number => {
  if (nextItems.length === 0) {
    return 0
  }

  const currentId = previousItems[previousIndex]?.id
  if (currentId !== undefined) {
    const sameSlideIndex = nextItems.findIndex((item) => item.id === currentId)
    if (sameSlideIndex >= 0) {
      return sameSlideIndex
    }
  }

  for (let index = previousIndex + 1; index < previousItems.length; index += 1) {
    const nextSlideIndex = nextItems.findIndex((item) => item.id === previousItems[index].id)
    if (nextSlideIndex >= 0) {
      return nextSlideIndex
    }
  }

  for (let index = previousIndex - 1; index >= 0; index -= 1) {
    const nextSlideIndex = nextItems.findIndex((item) => item.id === previousItems[index].id)
    if (nextSlideIndex >= 0) {
      return nextSlideIndex
    }
  }

  return Math.min(previousIndex, nextItems.length - 1)
}

export interface CarouselPointerValidation {
  valid: boolean
  safeIndex: number
  reason?: 'empty' | 'autoSkip' | 'outOfBounds' | 'no_playable'
}

export const validateCarouselPointer = (
  items: CarouselPointerItem[],
  index: number,
): CarouselPointerValidation => {
  if (items.length === 0) {
    return { valid: false, safeIndex: 0, reason: 'empty' }
  }

  const boundedIndex = Math.min(Math.max(index, 0), items.length - 1)
  if (boundedIndex !== index) {
    const safeIndex = findFirstPlayableIndex(items)
    return {
      valid: false,
      safeIndex: isPlayableIndex(items, safeIndex) ? safeIndex : 0,
      reason: 'outOfBounds',
    }
  }

  if (!items[boundedIndex]?.autoSkip) {
    return { valid: true, safeIndex: boundedIndex }
  }

  const safeIndex = findFirstPlayableIndex(items)
  if (isPlayableIndex(items, safeIndex)) {
    return { valid: false, safeIndex, reason: 'autoSkip' }
  }

  return { valid: false, safeIndex: 0, reason: 'no_playable' }
}

/** Recalcula o ponteiro após mudança de horário ou lista de itens. */
export const resolveIndexAfterItemsChange = (
  previousItems: CarouselPointerItem[],
  previousIndex: number,
  nextItems: CarouselPointerItem[],
): number => {
  if (nextItems.length === 0) {
    return 0
  }

  let remappedIndex = findRemappedIndex(previousItems, previousIndex, nextItems)
  if (nextItems[remappedIndex]?.autoSkip) {
    remappedIndex = findNextPlayableIndex(nextItems, remappedIndex)
  }

  return validateCarouselPointer(nextItems, remappedIndex).safeIndex
}

/** Simula avanços do timer para testes de ciclo completo. */
export const simulateCarouselAdvances = (
  items: CarouselPointerItem[],
  startIndex: number,
  steps: number,
): number[] => {
  const visited: number[] = []
  let currentIndex = validateCarouselPointer(items, startIndex).safeIndex

  for (let step = 0; step < steps; step += 1) {
    visited.push(currentIndex)
    if (items.length <= 1) {
      continue
    }

    currentIndex = findNextPlayableIndex(items, currentIndex)
    currentIndex = validateCarouselPointer(items, currentIndex).safeIndex
  }

  return visited
}
