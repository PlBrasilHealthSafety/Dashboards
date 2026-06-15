import { describe, expect, it } from 'vitest'
import { buildTvCarouselPointerItems, TV_PPT_LAYOUT_INDICES } from '@/lib/tv-carousel-pointer-model'
import {
  findFirstRenderablePptIndex,
  findNextPptLayoutIndex,
  findNextRenderablePptIndex,
  resolveTvPptFallbackIndex,
  validateTvCarouselPointer,
} from '@/lib/tv-ppt-fallback'

const buildTvItems = (showLooker: boolean, showBirthday: boolean) => {
  return buildTvCarouselPointerItems({ showLooker, showBirthday }).map((item) => ({
    ...item,
    content: item.autoSkip ? null : { id: item.id },
    duration: item.autoSkip ? 0 : 30000,
  }))
}

describe('tv-ppt-fallback', () => {
  it('salta bloco de Lookers vazios direto para o próximo PPT', () => {
    const items = buildTvItems(false, false)

    expect(findNextPptLayoutIndex(4, TV_PPT_LAYOUT_INDICES)).toBe(9)
    expect(resolveTvPptFallbackIndex(items, 5)).toBe(9)
    expect(resolveTvPptFallbackIndex(items, 6)).toBe(9)
    expect(resolveTvPptFallbackIndex(items, 7)).toBe(9)
  })

  it('sempre devolve um dos 8 índices PPT quando o nó atual está vazio', () => {
    const items = buildTvItems(false, false)

    for (const lookerIndex of [2, 5, 6, 7, 11]) {
      const safeIndex = validateTvCarouselPointer(items, lookerIndex).safeIndex
      expect(TV_PPT_LAYOUT_INDICES).toContain(safeIndex)
      expect(items[safeIndex]?.content).not.toBeNull()
    }
  })

  it('mantém Looker renderizável durante o horário', () => {
    const items = buildTvItems(true, false)
    const lookerIndex = 2

    const pointer = validateTvCarouselPointer(items, lookerIndex)
    expect(pointer.valid).toBe(true)
    expect(pointer.safeIndex).toBe(lookerIndex)
  })

  it('avança entre PPTs no ciclo de recuperação', () => {
    const items = buildTvItems(false, false)
    const first = findFirstRenderablePptIndex(items)
    const second = findNextRenderablePptIndex(items, first)

    expect(TV_PPT_LAYOUT_INDICES).toContain(first)
    expect(TV_PPT_LAYOUT_INDICES).toContain(second)
    expect(second).not.toBe(first)
  })

  it('volta ao PPT 1 após o último PPT do layout', () => {
    const items = buildTvItems(false, false)
    const lastPptIndex = TV_PPT_LAYOUT_INDICES[TV_PPT_LAYOUT_INDICES.length - 1]

    expect(findNextRenderablePptIndex(items, lastPptIndex)).toBe(TV_PPT_LAYOUT_INDICES[0])
  })
})
