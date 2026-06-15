/** Rota do modo TV (SPA). */
export const TV_DASHBOARD_PATH = '/tv-dashboard'

export const TV_SESSION_BROADCAST_CHANNEL = 'plbrasil-tv-session'

export const isTvDashboardPath = (pathname: string): boolean => {
  return pathname.includes(TV_DASHBOARD_PATH)
}

export const buildTvHardReloadUrl = (href: string, reason: string): string => {
  const url = new URL(href)
  url.searchParams.set('_tv', Date.now().toString())
  url.searchParams.set('_r', reason)
  return url.toString()
}

export const shouldReloadDiscardedTvTab = (wasDiscarded: boolean, pathname: string): boolean => {
  return wasDiscarded && isTvDashboardPath(pathname)
}

export interface TvSessionPeerMessage {
  type: 'hello' | 'ping'
  stationId: string
  tabId: string
  at: number
}

export const isDuplicateTvSessionMessage = (
  message: TvSessionPeerMessage,
  localStationId: string,
  localTabId: string,
): boolean => {
  return message.stationId === localStationId && message.tabId !== localTabId
}
