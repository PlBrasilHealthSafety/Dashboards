import { useState, useEffect, useRef, useCallback } from 'react'
import { toEmbedUrl } from '@/lib/lookerConfig'

interface LookerStudioSlideProps {
    /** URL do relatório no Looker Studio */
    url: string
    /** Título do dashboard (exibido durante loading) */
    title: string
    /** Intervalo de auto-refresh em ms (padrão: 5 minutos) */
    refreshInterval?: number
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
export function LookerStudioSlide({
    url,
    title,
    refreshInterval = 300000,
}: LookerStudioSlideProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    const iframeWidth = 1920
    const iframeHeight = 1080
    const embedUrl = toEmbedUrl(url)

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

    // Auto-refresh
    useEffect(() => {
        const timer = setInterval(() => {
            setRefreshKey(prev => prev + 1)
            setIsLoading(true)
            setHasError(false)
        }, refreshInterval)

        return () => clearInterval(timer)
    }, [refreshInterval])

    const handleLoad = useCallback(() => {
        setIsLoading(false)
        setHasError(false)
    }, [])

    const handleError = useCallback(() => {
        setIsLoading(false)
        setHasError(true)
    }, [])

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
                        transition: 'opacity 0.8s ease-in-out',
                        display: 'block',
                    }}
                    allowFullScreen
                    onLoad={handleLoad}
                    onError={handleError}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-storage-access-by-user-activation"
                />
            </div>
        </div>
    )
}
