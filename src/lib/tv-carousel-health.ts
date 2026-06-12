import { validateCarouselPointer } from '@/lib/carousel-pointer'
import { TV_MODE_CAROUSEL_LAYOUT } from '@/lib/lookerConfig'

export interface TvCarouselHealthItem {
  id: string | number
  autoSkip?: boolean
  duration?: number
  content?: unknown
}

export interface TvCarouselHealthReport {
  healthy: boolean
  issues: string[]
  safeIndex: number
  playableCount: number
  layoutSlotCount: number
}

const EXPECTED_TV_SLOT_COUNT = TV_MODE_CAROUSEL_LAYOUT.length
const EXPECTED_PPT_COUNT = TV_MODE_CAROUSEL_LAYOUT.filter((entry) => entry.kind === 'ppt').length

export const auditTvCarouselHealth = (
  items: TvCarouselHealthItem[],
  activeIndex: number,
): TvCarouselHealthReport => {
  const issues: string[] = []

  if (items.length !== EXPECTED_TV_SLOT_COUNT) {
    issues.push(`Layout da TV deve ter ${EXPECTED_TV_SLOT_COUNT} slots, encontrado ${items.length}.`)
  }

  const playableItems = items.filter((item) => !item.autoSkip)
  if (playableItems.length < EXPECTED_PPT_COUNT) {
    issues.push(`Menos de ${EXPECTED_PPT_COUNT} slides PPT jogáveis (${playableItems.length}).`)
  }

  if (playableItems.length === 0) {
    issues.push('Nenhum slide jogável na lista — a TV ficaria travada.')
  }

  const pointer = validateCarouselPointer(items, activeIndex)
  if (!pointer.valid) {
    issues.push(`Ponteiro inválido no índice ${activeIndex} (${pointer.reason ?? 'desconhecido'}).`)
  }

  const activeItem = items[pointer.safeIndex]
  if (!activeItem) {
    issues.push(`Slide ativo ausente no índice seguro ${pointer.safeIndex}.`)
  } else if (activeItem.autoSkip) {
    issues.push(`Slide ativo ${String(activeItem.id)} está marcado como autoSkip.`)
  } else if (activeItem.content == null) {
    issues.push(`Slide ativo ${String(activeItem.id)} não tem conteúdo.`)
  } else if (!activeItem.duration || activeItem.duration <= 0) {
    issues.push(`Slide ativo ${String(activeItem.id)} sem duração válida para o timer.`)
  }

  for (const [index, item] of items.entries()) {
    const shouldPlay = !item.autoSkip
    const hasContent = item.content != null
    if (shouldPlay && !hasContent) {
      issues.push(`Slot ${index} (${String(item.id)}) deveria exibir conteúdo, mas está vazio.`)
    }
    if (!shouldPlay && hasContent) {
      issues.push(`Slot ${index} (${String(item.id)}) está fora do horário mas ainda tem conteúdo montado.`)
    }
  }

  return {
    healthy: issues.length === 0,
    issues,
    safeIndex: pointer.safeIndex,
    playableCount: playableItems.length,
    layoutSlotCount: items.length,
  }
}
