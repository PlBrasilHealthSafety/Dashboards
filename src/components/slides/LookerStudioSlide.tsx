import { useState, useEffect, useRef, useCallback } from 'react'
import { toEmbedUrl } from '@/lib/lookerConfig'
import { isLookerEmbedLoaded, markLookerEmbedLoaded, prefetchLookerEmbed } from '@/lib/looker-preload-cache'

interface LookerStudioSlideProps {
    /** URL do relatório no Looker Studio */
    url: string
    /** Título do dashboard (exibido durante loading) */
    title: string
    /** Intervalo de auto-refresh em ms (padrão: 5 minutos) */
    refreshInterval?: number
    /** Tempo máximo de espera pelo iframe (0 = sem limite) */
    loadTimeoutMs?: number
    /** Chamado quando o dashboard não carrega (timeout ou erro) */
    onUnavailable?: () => void
}

const LOOKER_CONNECTION_HINTS = [
    'https://lookerstudio.google.com',
    'https://www.gstatic.com',
    'https://accounts.google.com',
]

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
 * 
 * Otimizado para TV:
 * - Renderiza o iframe em 1920x1080 e escala para caber na tela
 * - Mostra apenas a parte superior do dashboard (sem scroll)
 * - Tudo que não cabe é cortado (overflow hidden)
 * - Auto-refresh periódico para manter dados atualizados
 */
const TV_LOAD_TIMEOUT_MS = 25000

export function LookerStudioSlide({
    url,
    title,
    refreshInterval = 300000,
    loadTimeoutMs = 0,
    onUnavailable,
}: LookerStudioSlideProps) {
    const embedUrl = toEmbedUrl(url)
    const requiresLoadConfirmation = loadTimeoutMs > 0
    const [isLoading, setIsLoading] = useState(
        () => requiresLoadConfirmation || !isLookerEmbedLoaded(url)
    )
    const [hasError, setHasError] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    const iframeWidth = 1920
    const iframeHeight = 1080

    useEffect(() => {
        LOOKER_CONNECTION_HINTS.forEach(href => {
            ensureConnectionHint('preconnect', href)
            ensureConnectionHint('dns-prefetch', href)
        })
        prefetchLookerEmbed(url)
    }, [url])

    // Calcula escala para caber na largura da TV
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

    // Auto-refresh (desligado no Modo TV com refreshInterval={0})
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
        if (!requiresLoadConfirmation && isLookerEmbedLoaded(url)) {
            setIsLoading(false)
        }
    }, [requiresLoadConfirmation, url])

    useEffect(() => {
        const timeoutMs = loadTimeoutMs > 0 ? loadTimeoutMs : (refreshInterval === 0 ? TV_LOAD_TIMEOUT_MS : 0)
        if (timeoutMs <= 0) {
            return
        }

        const timeoutId = window.setTimeout(() => {
            setIsLoading(false)
            setHasError(true)
            onUnavailable?.()
        }, timeoutMs)

        return () => window.clearTimeout(timeoutId)
    }, [loadTimeoutMs, onUnavailable, refreshInterval, url])

    const handleLoad = useCallback(() => {
        markLookerEmbedLoaded(url)
        setIsLoading(false)
        setHasError(false)
    }, [url])

    const handleError = useCallback(() => {
        setIsLoading(false)
        setHasError(true)
        onUnavailable?.()
    }, [onUnavailable])

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            style={{ backgroundColor: '#f8f9fa' }}
        >
            {/* Loading overlay */}
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
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="rounded-full animate-pulse"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: 'rgba(0, 162, 152, 0.2)',
                                }}
                            />
                        </div>
                    </div>
                    <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 600, marginBottom: '12px', textAlign: 'center', padding: '0 32px' }}>
                        {title}
                    </h2>
                    <p className="animate-pulse" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                        Carregando dashboard em tempo real...
                    </p>
                </div>
            )}

            {/* Error state */}
            {hasError && !isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
                    <div style={{
                        width: '64px', height: '64px', marginBottom: '24px', borderRadius: '50%',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg style={{ width: '32px', height: '32px', color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Erro ao carregar dashboard</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '4px' }}>{title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Verifique se o embedding está habilitado no Looker Studio</p>
                </div>
            )}

            {/* Iframe fixo — mostra apenas o que cabe na tela, sem scroll */}
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
                    }}
                    allowFullScreen
                    loading="eager"
                    onLoad={handleLoad}
                    onError={handleError}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-storage-access-by-user-activation"
                />
            </div>
        </div>
    )
}
