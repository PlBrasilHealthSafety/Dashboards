import { describe, expect, it } from 'vitest'
import { auditTvCarouselHealth } from '@/lib/tv-carousel-health'
import { buildTvCarouselPointerItems } from '@/lib/tv-carousel-pointer-model'

describe('auditTvCarouselHealth', () => {
  it('aprova carrossel saudável fora do horário Looker', () => {
    const items = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false }).map((item) => ({
      ...item,
      content: item.autoSkip ? null : {},
      duration: item.autoSkip ? 0 : 30000,
    }))

    const report = auditTvCarouselHealth(items, 0)
    expect(report.healthy).toBe(true)
    expect(report.issues).toHaveLength(0)
    expect(report.playableCount).toBe(8)
    expect(report.layoutSlotCount).toBe(14)
  })

  it('reprova ponteiro em Looker autoSkip (cenário do travamento)', () => {
    const items = buildTvCarouselPointerItems({ showLooker: false, showBirthday: false }).map((item) => ({
      ...item,
      content: item.autoSkip ? null : {},
      duration: item.autoSkip ? 0 : 30000,
    }))

    const lookerIndex = 2
    const report = auditTvCarouselHealth(items, lookerIndex)
    expect(report.healthy).toBe(false)
    expect(report.safeIndex).toBe(3)
    expect(report.issues.some((issue) => issue.includes('autoSkip'))).toBe(true)
  })

  it('reprova slide jogável sem conteúdo', () => {
    const items = buildTvCarouselPointerItems({ showLooker: true, showBirthday: false }).map((item) => ({
      ...item,
      content: null,
      duration: 30000,
    }))

    const report = auditTvCarouselHealth(items, 0)
    expect(report.healthy).toBe(false)
    expect(report.issues.some((issue) => issue.includes('vazio'))).toBe(true)
  })

  it('reprova lista com slots a menos', () => {
    const report = auditTvCarouselHealth(
      [{ id: 1, content: {}, duration: 30000 }],
      0,
    )
    expect(report.healthy).toBe(false)
    expect(report.issues.some((issue) => issue.includes('14 slots'))).toBe(true)
  })
})
