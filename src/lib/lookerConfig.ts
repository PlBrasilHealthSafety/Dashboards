/**
 * Configuração dos dashboards do Looker Studio para exibição no modo TV.
 * 
 * Para adicionar um novo dashboard:
 * 1. Copie a URL do Looker Studio (da barra de endereço do navegador)
 * 2. Adicione um novo objeto ao array LOOKER_DASHBOARDS abaixo
 * 3. Faça deploy na Vercel
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
  /** Tempo de exibição em milissegundos (padrão: 120000 = 2 minutos) */
  duration: number
}

/**
 * Converte uma URL normal do Looker Studio para URL de embed.
 * Exemplo:
 *   Input:  https://lookerstudio.google.com/reporting/abc123/page/xyz
 *   Output: https://lookerstudio.google.com/embed/reporting/abc123/page/xyz
 */
export function toEmbedUrl(url: string): string {
  return url.replace(
    'lookerstudio.google.com/reporting/',
    'lookerstudio.google.com/embed/reporting/'
  )
}

/** Lista de dashboards do Looker Studio para exibir no modo TV */
export const LOOKER_DASHBOARDS: LookerDashboard[] = [
  {
    id: 'medicina-convocacao',
    title: 'Painel de Gestão - Medicina | Convocação',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_0uqh1u4wqc',
    duration: 120000,
  },
  {
    id: 'medicina-liberacao',
    title: 'Painel de Gestão - Medicina | Liberação Dados Gerais',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_yh591qsi1d',
    duration: 120000,
  },
  {
    id: 'medicina-agendamento',
    title: 'Painel de Gestão - Medicina | Agendamento',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_awpgjxuj1d',
    duration: 120000,
  },
  {
    id: 'medicina-desempenho-agendamento',
    title: 'Painel de Gestão - Medicina | Desempenho Agendamento',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_r7a8jh4j1d',
    duration: 120000,
  },
  {
    id: 'medicina-asos',
    title: 'Painel de Gestão - Medicina | ASOs Dados Gerais',
    url: 'https://lookerstudio.google.com/reporting/2de67f3b-73c4-4f68-a838-d51840abbad6/page/p_4mmpny8c0c',
    duration: 120000,
  },
]
