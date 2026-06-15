import { Component, type ErrorInfo, type ReactNode } from 'react'
import { buildTvHardReloadUrl } from '@/lib/tv-session-shield'

interface TvErrorBoundaryProps {
  children: ReactNode
}

interface TvErrorBoundaryState {
  hasError: boolean
}

export class TvErrorBoundary extends Component<TvErrorBoundaryProps, TvErrorBoundaryState> {
  state: TvErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): TvErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('TVDashboard: erro React capturado.', error, info.componentStack)
    window.location.replace(buildTvHardReloadUrl(window.location.href, 'react_error'))
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white/70">
          Reiniciando exibição da TV...
        </div>
      )
    }

    return this.props.children
  }
}
