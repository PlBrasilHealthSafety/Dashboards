import { useState, useEffect, useRef, useCallback } from 'react'
import { toEmbedUrl } from '@/lib/lookerConfig'
import { prefetchLookerEmbed } from '@/lib/looker-preload-cache'

interface LookerStudioSlideProps {
    /** URL do relatório no Looker Studio */
    url: string
    /** Título do dashboard (exibido durante loading) */
    title: string
    /** Intervalo de auto-refresh em ms (padrão: 5 minutos) */
    refreshInterval?: number
    /** Tempo máximo de espera pelo iframe (0 = sem limite) */
    loadTimeoutMs?: number
    /** Modo TV: ignora cache de preload e força timeout agressivo */
    tvMode?: boolean
    /** Chamado quando o dashboard não carrega (timeout ou erro) */
    onUnavailable?: () => void
}

const LOOKER_CONNECTION_HINTS = [
    'https://lookerstudio.google.com',
    'https://www.gstatic.com',
    'https://accounts.google.com',
]

const TV_LOAD_TIMEOUT_MS = 90000

const ensureConnectionHint = (rel: 'preconnect' | 'dns-prefetch', href: string) => {
    const selector = `link[rel="${rel}"][href="${href}"]`

    if (document.head.querySelector(selector)) {
        return
    }

    const link = document.createElement('link')
    link.rel = rel
    link.href = href

    if (rel === 'preconnect') {
        link.crossOrigin = 'anonymous'
    }

    document.head.appendChild(link)
}

/**
 * Componente de slide que exibe um dashboard do Looker Studio via iframe.
 */
export function LookerStudioSlide({
    url,
    title,
    refreshInterval = 300000,
    loadTimeoutMs = 0,
    tvMode = false,
    onUnavailable,
}: LookerStudioSlideProps) {
    const embedUrl = toEmbedUrl(url)
    const onUnavailableRef = useRef(onUnavailable)
    onUnavailableRef.current = onUnavailable

    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const hasReportedUnavailableRef = useRef(false)

    const iframeWidth = 1920
    const iframeHeight = 1080

    const reportUnavailable = useCallback((reason: string) => {
        if (hasReportedUnavailableRef.current) {
            return
        }

        hasReportedUnavailableRef.current = true
        console.warn('LookerStudioSlide: dashboard indisponivel na TV.', { title, reason })
        setIsLoading(false)
        setHasError(true)
        onUnavailableRef.current?.()
    }, [title])

    useEffect(() => {
        hasReportedUnavailableRef.current = false
        setIsLoading(true)
        setHasError(false)
    }, [url, refreshKey])

    useEffect(() => {
        LOOKER_CONNECTION_HINTS.forEach(href => {
            ensureConnectionHint('preconnect', href)
            ensureConnectionHint('dns-prefetch', href)
        })
        prefetchLookerEmbed(url)
    }, [url])

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                setScale(containerWidth / iframeWidth)
            }
        }

        updateScale()
        window.addEventListener('resize', updateScale)
        return () => window.removeEventListener('resize', updateScale)
    }, [])

    useEffect(() => {
        if (refreshInterval <= 0) {
            return
        }

        const timer = window.setInterval(() => {
            setRefreshKey(prev => prev + 1)
            setIsLoading(true)
            setHasError(false)
        }, refreshInterval)

        return () => window.clearInterval(timer)
    }, [refreshInterval])

    useEffect(() => {
        if (tvMode) {
            return
        }

        const timeoutMs = loadTimeoutMs > 0 ? loadTimeoutMs : 0

        if (timeoutMs <= 0) {
            return
        }

        const timeoutId = window.setTimeout(() => {
            reportUnavailable('load_timeout')
        }, timeoutMs)

        return () => window.clearTimeout(timeoutId)
    }, [loadTimeoutMs, reportUnavailable, refreshKey, tvMode, url])

    useEffect(() => {
        if (!tvMode) {
            return
        }

        const timeoutId = window.setTimeout(() => {
            if (hasReportedUnavailableRef.current) {
                return
            }

            setIsLoading(false)
        }, TV_LOAD_TIMEOUT_MS)

        return () => window.clearTimeout(timeoutId)
    }, [refreshKey, title, tvMode, url])

    const handleLoad = useCallback(() => {
        if (tvMode) {
            window.setTimeout(() => {
                setIsLoading(false)
                setHasError(false)
            }, 400)
            return
        }

        setIsLoading(false)
        setHasError(false)
    }, [tvMode])

    const handleError = useCallback(() => {
        if (tvMode) {
            setIsLoading(false)
            return
        }

        reportUnavailable('iframe_error')
    }, [reportUnavailable, title, tvMode])

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            style={{ backgroundColor: '#0a1628' }}
        >
            {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
                    <div className="relative mb-8">
                        <div
                            className="rounded-full animate-spin"
                            style={{
                                width: '80px',
                                height: '80px',
                                border: '4px solid rgba(0, 162, 152, 0.2)',
                                borderTopColor: '#00A298',
                            }}
                        />
                    </div>
                    <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 600, marginBottom: '12px', textAlign: 'center', padding: '0 32px' }}>
                        {title}
                    </h2>
                    <p className="animate-pulse" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                        Carregando dashboard...
                    </p>
                </div>
            )}

            {hasError && !isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
                    <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Dashboard indisponível</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '8px' }}>Avançando para o próximo slide...</p>
                </div>
            )}

            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${iframeWidth}px`,
                    height: `${iframeHeight}px`,
                    transformOrigin: 'top left',
                    transform: `scale(${scale})`,
                    overflow: 'hidden',
                }}
            >
                <iframe
                    key={refreshKey}
                    src={embedUrl}
                    title={title}
                    style={{
                        width: `${iframeWidth}px`,
                        height: `${iframeHeight}px`,
                        border: 'none',
                        opacity: isLoading ? 0 : 1,
                        transition: 'opacity 0.35s ease-in-out',
                        display: 'block',
                        backgroundColor: '#0a1628',
                    }}
                    allowFullScreen
                    loading="eager"
                    onLoad={handleLoad}
                    onError={handleError}
                    {...(tvMode
                        ? {}
                        : {
                            sandbox:
                              'allow-scripts allow-same-origin allow-popups allow-forms allow-storage-access-by-user-activation',
                          })}
                />
            </div>
        </div>
    )
}
