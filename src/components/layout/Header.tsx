import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="relative border-b bg-gradient-to-r from-teal-600/20 via-cyan-500/10 to-indigo-600/20 dark:from-teal-900/30 dark:via-cyan-900/20 dark:to-indigo-900/30 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-500 shadow-md" />
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}