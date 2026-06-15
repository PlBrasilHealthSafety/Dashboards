import { describe, expect, it } from 'vitest'
import {
  findFirstPlayableIndex,
  findNextPlayableIndex,
  findPreviousPlayableIndex,
  findRemappedIndex,
  findNextRenderableIndex,
  isPlayableIndex,
  isRenderableCarouselItem,
  resolveIndexAfterItemsChange,
  resolveRenderableIndexAfterItemsChange,
  simulateCarouselAdvances,
  validateCarouselPointer,
  validateRenderablePointer,
  type CarouselPointerItem,
} from '@/lib/carousel-pointer'
import {
  buildTvCarouselPointerItems,
  TV_BIRTHDAY_LAYOUT_INDEX,
  TV_LOOKER_LAYOUT_INDICES,
  TV_PPT_LAYOUT_INDICES,
} from '@/lib/tv-carousel-pointer-model'
import { getLookerCarouselId, TV_MODE_CAROUSEL_LAYOUT } from '@/lib/lookerConfig'

const SCHEDULE_MODES = [
  { showLooker: true, showBirthday: true, label: 'looker+birthday' },
  { showLooker: true, showBirthday: false, label: 'looker only' },
  { showLooker: false, showBirthday: true, label: 'birthday only' },
  { showLooker: false, showBirthday: false, label: 'ppt only' },
] as const

const expectPlayable = (items: CarouselPointerItem[], index: number) => {
  expect(isPlayableIndex(items, index)).toBe(true)
  expect(items[index]?.autoSkip).not.toBe(true)
  expect(validateCarouselPointer(items, index).valid).toBe(true)
}

describe('carousel-pointer', () => {
  describe('findNextPlayableIndex', () => {
    it('pula um único autoSkip no meio', () => {
      const items: CarouselPointerItem[] = [
        { id: 'a' },
        { id: 'b', autoSkip: true },
        { id: 'c' },
      ]
      expect(findNextPlayableIndex(items, 0)).toBe(2)
    })

    it('pula vários autoSkip consecutivos', () => {
      const items: CarouselPointerItem[] = [
        { id: 'a' },
        { id: 'x', autoSkip: true },
        { id: 'y', autoSkip: true },
        { id: 'z', autoSkip: true },
        { id: 'b' },
      ]
      expect(findNextPlayableIndex(items, 0)).toBe(4)
    })

    it('volta ao início quando só o primeiro é jogável', () => {
      const items: CarouselPointerItem[] = [
        { id: 'only' },
        { id: 'skip1', autoSkip: true },
        { id: 'skip2', autoSkip: true },
      ]
      expect(findNextPlayableIndex(items, 0)).toBe(0)
    })

    it('encontra jogável no meio da lista', () => {
      const items: CarouselPointerItem[] = [
        { id: 'skip', autoSkip: true },
        { id: 'skip2', autoSkip: true },
        { id: 'play' },
        { id: 'skip3', autoSkip: true },
      ]
      expect(findNextPlayableIndex(items, 0)).toBe(2)
      expect(findNextPlayableIndex(items, 3)).toBe(2)
    })
  })

  describe('validateCarouselPointer', () => {
    it('corrige índice em autoSkip', () => {
      const items: CarouselPointerItem[] = [
        { id: 1 },
        { id: 'skip', autoSkip: true },
      ]
      const result = validateCarouselPointer(items, 1)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('autoSkip')
      expect(result.safeIndex).toBe(0)
    })

    it('corrige índice fora dos limites', () => {
      const items: CarouselPointerItem[] = [{ id: 1 }, { id: 2 }]
      const result = validateCarouselPointer(items, 99)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('outOfBounds')
      expect(result.safeIndex).toBe(0)
    })
  })

  describe('resolveIndexAfterItemsChange', () => {
    it('mantém o mesmo slide quando ainda é jogável', () => {
      const items = buildTvCarouselPointerItems({ showLooker: true, showBirthday: false })
      const next = resolveIndexAfterItemsChange(items, 0, items)
      expect(next).toBe(0)
    })

    it('sai do Looker para PPT3 quando horário Looker acaba', () => {
      const inWindow = buildTvCarouselPointerItems({ showLooker: true, showBirthday: false })
      const outWindow = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false })
      const lookerIndex = TV_LOOKER_LAYOUT_INDICES[0]
      const resolved = resolveIndexAfterItemsChange(inWindow, lookerIndex, outWindow)
      expect(resolved).toBe(3)
      expect(outWindow[resolved]?.id).toBe(3)
      expectPlayable(outWindow, resolved)
    })

    it('sai do aniversário para PPT5 quando janela fecha', () => {
      const inWindow = buildTvCarouselPointerItems({ showLooker: false, showBirthday: true })
      const outWindow = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false })
      const resolved = resolveIndexAfterItemsChange(inWindow, TV_BIRTHDAY_LAYOUT_INDEX, outWindow)
      expect(resolved).toBe(9)
      expect(outWindow[resolved]?.id).toBe(5)
    })
  })
})

describe('TV carousel pointer model', () => {
  it('mantém layout fixo de 14 slots em qualquer horário', () => {
    for (const mode of SCHEDULE_MODES) {
      const items = buildTvCarouselPointerItems(mode)
      expect(items).toHaveLength(TV_MODE_CAROUSEL_LAYOUT.length)
      expect(items).toHaveLength(14)
    }
  })

  it('sempre tem exatamente 8 PPTs jogáveis', () => {
    for (const mode of SCHEDULE_MODES) {
      const items = buildTvCarouselPointerItems(mode)
      const playablePpts = items.filter((item) => typeof item.id === 'number' && !item.autoSkip)
      expect(playablePpts).toHaveLength(8)
    }
  })

  SCHEDULE_MODES.forEach((mode) => {
    describe(`modo: ${mode.label}`, () => {
      const items = buildTvCarouselPointerItems(mode)

      it('primeiro slide jogável é PPT1', () => {
        expect(findFirstPlayableIndex(items)).toBe(0)
        expect(items[findFirstPlayableIndex(items)]?.id).toBe(1)
      })

      it.each(TV_PPT_LAYOUT_INDICES)('índice PPT %i é sempre jogável', (index) => {
        expectPlayable(items, index)
      })

      if (!mode.showLooker) {
        it.each(TV_LOOKER_LAYOUT_INDICES)('Looker índice %i é autoSkip', (index) => {
          expect(items[index]?.autoSkip).toBe(true)
        })
      } else {
        it.each(TV_LOOKER_LAYOUT_INDICES)('Looker índice %i é jogável', (index) => {
          expectPlayable(items, index)
        })
      }

      if (!mode.showBirthday) {
        it('aniversário é autoSkip', () => {
          expect(items[TV_BIRTHDAY_LAYOUT_INDEX]?.autoSkip).toBe(true)
        })
      } else {
        it('aniversário é jogável', () => {
          expectPlayable(items, TV_BIRTHDAY_LAYOUT_INDEX)
        })
      }

      it.each([...Array(items.length).keys()])(
        'avanço a partir do índice %i nunca para em autoSkip',
        (startIndex) => {
          const next = findNextPlayableIndex(items, startIndex)
          if (items.length > 1) {
            expectPlayable(items, next)
          }
        },
      )

      it.each([...Array(items.length).keys()])(
        'retrocesso a partir do índice %i nunca para em autoSkip',
        (startIndex) => {
          const previous = findPreviousPlayableIndex(items, startIndex)
          if (items.length > 1) {
            expectPlayable(items, previous)
          }
        },
      )

      it('200 avanços nunca visitam slide autoSkip', () => {
        const visited = simulateCarouselAdvances(items, 0, 200)
        expect(visited.length).toBe(200)
        for (const index of visited) {
          expectPlayable(items, index)
        }
      })
    })
  })

  describe('regressão: 3º slide visível (após PPT1 e PPT2)', () => {
    it('fora do horário Looker: 3º slide exibido é PPT3 no índice 3', () => {
      const items = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false })
      const afterPpt1 = findNextPlayableIndex(items, 0)
      const afterPpt2 = findNextPlayableIndex(items, afterPpt1)
      expect(items[afterPpt1]?.id).toBe(2)
      expect(items[afterPpt2]?.id).toBe(3)
      expect(afterPpt2).toBe(3)
      expectPlayable(items, afterPpt2)
    })

    it('nunca deixa o ponteiro no Looker autoSkip após sair do PPT2', () => {
      const inWindow = buildTvCarouselPointerItems({ showLooker: true, showBirthday: false })
      const outWindow = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false })
      const lookerIndex = TV_LOOKER_LAYOUT_INDICES[0]
      const nextAfterPpt2 = findNextPlayableIndex(outWindow, 1)
      expect(nextAfterPpt2).not.toBe(lookerIndex)
      const afterScheduleEndsOnLooker = resolveIndexAfterItemsChange(inWindow, lookerIndex, outWindow)
      expect(afterScheduleEndsOnLooker).toBe(3)
      expect(validateCarouselPointer(outWindow, afterScheduleEndsOnLooker).valid).toBe(true)
    })
  })

  describe('regressão: bug do flatMap (ponteiro no vazio após PPT2)', () => {
    it('PPT2 → próximo é PPT3, não Looker, fora do horário', () => {
      const items = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false })
      const afterPpt2 = findNextPlayableIndex(items, 1)
      expect(afterPpt2).toBe(3)
      expect(items[afterPpt2]?.id).toBe(3)
    })

    it('lista não encolhe — índice 2 continua sendo Looker (autoSkip), não PPT3', () => {
      const items = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false })
      expect(items[2]?.id).toBe(getLookerCarouselId('medicina-convocacao'))
      expect(items[2]?.autoSkip).toBe(true)
      expect(items[3]?.id).toBe(3)
    })
  })

  describe('transições de horário em cada índice', () => {
    const transitions = [
      {
        label: 'Looker acaba',
        from: { showLooker: true, showBirthday: false },
        to: { showLooker: false, showBirthday: false },
      },
      {
        label: 'Looker começa',
        from: { showLooker: false, showBirthday: false },
        to: { showLooker: true, showBirthday: false },
      },
      {
        label: 'Aniversário acaba',
        from: { showLooker: false, showBirthday: true },
        to: { showLooker: false, showBirthday: false },
      },
      {
        label: 'Looker e aniversário acabam juntos',
        from: { showLooker: true, showBirthday: true },
        to: { showLooker: false, showBirthday: false },
      },
    ] as const

    transitions.forEach(({ label, from, to }) => {
      describe(label, () => {
        const previousItems = buildTvCarouselPointerItems(from)
        const nextItems = buildTvCarouselPointerItems(to)

        it.each([...Array(previousItems.length).keys()])(
          'índice atual %i resolve para slide jogável',
          (currentIndex) => {
            const resolved = resolveIndexAfterItemsChange(previousItems, currentIndex, nextItems)
            expectPlayable(nextItems, resolved)
          },
        )
      })
    })
  })

  describe('sequência completa dentro do horário Looker', () => {
    it('PPT1 → PPT2 → Looker convocação', () => {
      const items = buildTvCarouselPointerItems({ showLooker: true, showBirthday: false })
      let index = 0
      index = findNextPlayableIndex(items, index)
      expect(items[index]?.id).toBe(2)
      index = findNextPlayableIndex(items, index)
      expect(items[index]?.id).toBe(getLookerCarouselId('medicina-convocacao'))
    })

    it('percorre todos os 14 slots quando tudo está ativo', () => {
      const items = buildTvCarouselPointerItems({ showLooker: true, showBirthday: true })
      const visited = simulateCarouselAdvances(items, 0, 14)
      const unique = new Set(visited)
      expect(unique.size).toBe(14)
    })
  })

  describe('modo só PPT (fora de todos os horários)', () => {
    const items = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false })

    it('ciclo de 8 PPTs retorna ao início', () => {
      let index = 0
      for (let step = 0; step < 8; step += 1) {
        expect(TV_PPT_LAYOUT_INDICES).toContain(index)
        index = findNextPlayableIndex(items, index)
      }
      expect(index).toBe(0)
    })

    it('nunca visita índices Looker ou aniversário em 50 avanços', () => {
      const visited = simulateCarouselAdvances(items, 0, 50)
      for (const index of visited) {
        expect(TV_PPT_LAYOUT_INDICES).toContain(index)
      }
    })
  })

  describe('findRemappedIndex preserva identidade do slide', () => {
    it('mesmo id após mudança de autoSkip mantém índice', () => {
      const before: CarouselPointerItem[] = [
        { id: 1 },
        { id: 2 },
        { id: 'looker-a' },
      ]
      const after: CarouselPointerItem[] = [
        { id: 1 },
        { id: 2 },
        { id: 'looker-a', autoSkip: true },
      ]
      expect(findRemappedIndex(before, 2, after)).toBe(2)
      expect(resolveIndexAfterItemsChange(before, 2, after)).toBe(0)
    })
  })

  describe('validateRenderablePointer', () => {
    it('pula slot sem conteúdo mesmo quando autoSkip é false', () => {
      const items = [
        { id: 1, content: 'ppt-1' },
        { id: 'looker-a', autoSkip: false, content: null },
        { id: 2, content: 'ppt-2' },
      ]

      expect(isRenderableCarouselItem(items[1])).toBe(false)
      expect(validateRenderablePointer(items, 1).safeIndex).toBe(2)
      expect(findNextRenderableIndex(items, 1)).toBe(2)
    })

    it('recalcula ponteiro após looker perder conteúdo no meio da rotação', () => {
      const before = [
        { id: 1, content: 'ppt-1' },
        { id: 'looker-a', autoSkip: false, content: 'looker' },
        { id: 2, content: 'ppt-2' },
      ]
      const after = [
        { id: 1, content: 'ppt-1' },
        { id: 'looker-a', autoSkip: true, content: null },
        { id: 2, content: 'ppt-2' },
      ]

      expect(resolveRenderableIndexAfterItemsChange(before, 1, after)).toBe(2)
    })
  })
})
