/** 4 minutos por painel Looker no Modo TV (tempo de leitura na tela). */
export const LOOKER_TV_SLIDE_DURATION_MS = 4 * 60 * 1000

/**
 * Configuração dos dashboards do Looker Studio para exibição no modo TV.
 *
 * Para adicionar um novo dashboard:
 * 1. Copie a URL do Looker Studio (da barra de endereço do navegador)
 * 2. Adicione um novo objeto ao array LOOKER_DASHBOARDS abaixo
 * 3. Ajuste horários/ciclos em looker-schedule.ts (fuso America/Sao_Paulo)
 * 4. Faça deploy na Vercel
 *
 * IMPORTANTE: O embedding precisa estar habilitado no Looker Studio:
 * - Abrir o relatório → Editar → File → Embed Report → Enable Embedding
 * - Compartilhamento como "Público" ou "Qualquer pessoa com o link"
 */

export interface LookerDashboard {
  /** Identificador único do dashboard */
  id: string
  /** Nome exibido durante o loading do slide */
  title: string
  /** URL completa do Looker Studio (será convertida para URL de embed automaticamente) */
  url: string
  /** Tempo de exibição em milissegundos no Modo TV */
  duration: number
}

export type TvCarouselEntry =
  | { kind: 'looker'; dashboardId: string }
  | { kind: 'ppt'; slide: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 }
  | { kind: 'birthday' }

/**
 * Converte uma URL normal do Looker Studio para URL de embed.
 */
export function toEmbedUrl(url: string): string {
  return url.replace(
    'lookerstudio.google.com/reporting/',
    'lookerstudio.google.com/embed/reporting/'
  )
}

/** Lista de dashboards do Looker Studio */
export const LOOKER_DASHBOARDS: LookerDashboard[] = [
  {
    id: 'medicina-convocacao',
    title: 'Painel de Gestão - Medicina | Convocação',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_0uqh1u4wqc',
    duration: LOOKER_TV_SLIDE_DURATION_MS,
  },
  {
    id: 'medicina-liberacao',
    title: 'Painel de Gestão - Medicina | Liberação Dados Gerais',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_yh591qsi1d',
    duration: LOOKER_TV_SLIDE_DURATION_MS,
  },
  {
    id: 'medicina-agendamento',
    title: 'Painel de Gestão - Medicina | Agendamento',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_awpgjxuj1d',
    duration: LOOKER_TV_SLIDE_DURATION_MS,
  },
  {
    id: 'medicina-desempenho-agendamento',
    title: 'Painel de Gestão - Medicina | Desempenho Agendamento',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_r7a8jh4j1d',
    duration: LOOKER_TV_SLIDE_DURATION_MS,
  },
  {
    id: 'medicina-asos',
    title: 'Painel de Gestão - Medicina | ASOs Dados Gerais',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_4mmpny8c0c',
    duration: LOOKER_TV_SLIDE_DURATION_MS,
  },
]

export const LOOKER_DASHBOARD_MAP = Object.fromEntries(
  LOOKER_DASHBOARDS.map((dashboard) => [dashboard.id, dashboard])
) as Record<string, LookerDashboard>

/**
 * Ordem do Modo TV: intercala 2 PPT → Looker → 2 PPT → Looker → 2 Looker →
 * aniversariantes (se na janela) → 2 PPT → Looker → 2 PPT finais.
 */
export const TV_MODE_CAROUSEL_LAYOUT: TvCarouselEntry[] = [
  { kind: 'ppt', slide: 1 },
  { kind: 'ppt', slide: 2 },
  { kind: 'looker', dashboardId: 'medicina-convocacao' },
  { kind: 'ppt', slide: 3 },
  { kind: 'ppt', slide: 4 },
  { kind: 'looker', dashboardId: 'medicina-liberacao' },
  { kind: 'looker', dashboardId: 'medicina-agendamento' },
  { kind: 'looker', dashboardId: 'medicina-desempenho-agendamento' },
  { kind: 'birthday' },
  { kind: 'ppt', slide: 5 },
  { kind: 'ppt', slide: 6 },
  { kind: 'looker', dashboardId: 'medicina-asos' },
  { kind: 'ppt', slide: 7 },
  { kind: 'ppt', slide: 8 },
]

export const getLookerCarouselId = (dashboardId: string) => `looker-${dashboardId}`

export const isLookerCarouselId = (slideId: string | number): slideId is `looker-${string}` => {
  return typeof slideId === 'string' && slideId.startsWith('looker-')
}

export const getLookerDashboardIdFromCarouselId = (slideId: `looker-${string}`) => {
  return slideId.slice('looker-'.length)
}
