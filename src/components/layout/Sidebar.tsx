import { ReactNode } from 'react'

interface SidebarProps {
  children: ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-64 bg-muted/50 border-r min-h-screen p-4">
      {children}
    </aside>
  )
}