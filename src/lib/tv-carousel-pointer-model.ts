import { BIRTHDAY_SLIDE_ID } from '@/hooks/useBirthdaySlideSchedule'
import {
  getLookerCarouselId,
  TV_MODE_CAROUSEL_LAYOUT,
  type TvCarouselEntry,
} from '@/lib/lookerConfig'
import type { CarouselPointerItem } from '@/lib/carousel-pointer'

export interface TvCarouselSchedule {
  showLooker: boolean
  showBirthday: boolean
}

/** Espelha a lógica de autoSkip do TVDashboard sem React. */
export const buildTvCarouselPointerItems = ({
  showLooker,
  showBirthday,
}: TvCarouselSchedule): CarouselPointerItem[] => {
  return TV_MODE_CAROUSEL_LAYOUT.map((entry: TvCarouselEntry): CarouselPointerItem => {
    if (entry.kind === 'ppt') {
      return { id: entry.slide, autoSkip: false }
    }

    if (entry.kind === 'birthday') {
      return { id: BIRTHDAY_SLIDE_ID, autoSkip: !showBirthday }
    }

    return { id: getLookerCarouselId(entry.dashboardId), autoSkip: !showLooker }
  })
}

/** Índices esperados dos 8 PPTs na ordem do layout fixo. */
export const TV_PPT_LAYOUT_INDICES = TV_MODE_CAROUSEL_LAYOUT.flatMap((entry, index) => {
  return entry.kind === 'ppt' ? [index] : []
})

export const TV_LOOKER_LAYOUT_INDICES = TV_MODE_CAROUSEL_LAYOUT.flatMap((entry, index) => {
  return entry.kind === 'looker' ? [index] : []
})

export const TV_BIRTHDAY_LAYOUT_INDEX = TV_MODE_CAROUSEL_LAYOUT.findIndex((entry) => entry.kind === 'birthday')
