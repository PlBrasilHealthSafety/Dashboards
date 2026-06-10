import { toEmbedUrl } from '@/lib/lookerConfig'

const loadedEmbedUrls = new Set<string>()

export const getLookerEmbedUrl = (reportUrl: string) => toEmbedUrl(reportUrl)

export const isLookerEmbedLoaded = (reportUrl: string) => {
  return loadedEmbedUrls.has(getLookerEmbedUrl(reportUrl))
}

export const markLookerEmbedLoaded = (reportUrl: string) => {
  loadedEmbedUrls.add(getLookerEmbedUrl(reportUrl))
}

export const prefetchLookerEmbed = (reportUrl: string) => {
  const embedUrl = getLookerEmbedUrl(reportUrl)
  const selector = `link[rel="prefetch"][href="${embedUrl}"]`

  if (document.head.querySelector(selector)) {
    return
  }

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = embedUrl
  link.as = 'document'
  document.head.appendChild(link)
}
