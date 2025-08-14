import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function AppLayout() {
  return (
    <div className="min-h-screen text-foreground bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Background pattern PLBrasil - profissional e sutil */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle_at_25%_15%,rgba(0,162,152,0.15)_0%,transparent_50%),radial-gradient(circle_at_75%_85%,rgba(29,60,68,0.14)_0%,transparent_55%),radial-gradient(circle_at_45%_50%,rgba(174,206,203,0.07)_0%,transparent_40%)]" />
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}