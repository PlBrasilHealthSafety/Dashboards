import { useEffect } from 'react'
import { LOOKER_DASHBOARDS } from '@/lib/lookerConfig'
import { getLookerEmbedUrl, markLookerEmbedLoaded, prefetchLookerEmbed } from '@/lib/looker-preload-cache'

/**
 * Pré-carrega todos os painéis Looker em segundo plano ao abrir o Modo TV.
 */
export function LookerDashboardPreloader() {
  useEffect(() => {
    LOOKER_DASHBOARDS.forEach((dashboard) => {
      prefetchLookerEmbed(dashboard.url)
    })
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed overflow-hidden opacity-0"
      style={{ left: '-10000px', top: 0, width: '1920px', height: '1080px' }}
    >
      {LOOKER_DASHBOARDS.map((dashboard) => {
        const embedUrl = getLookerEmbedUrl(dashboard.url)

        return (
          <iframe
            key={dashboard.id}
            src={embedUrl}
            title={`Preload ${dashboard.title}`}
            width={1920}
            height={1080}
            loading="eager"
            tabIndex={-1}
            onLoad={() => markLookerEmbedLoaded(dashboard.url)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-storage-access-by-user-activation"
          />
        )
      })}
    </div>
  )
}
