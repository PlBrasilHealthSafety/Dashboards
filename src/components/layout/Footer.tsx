export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-[#00A298]/8 via-white to-[#1D3C44]/8 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg font-semibold bg-gradient-to-r from-[#00A298] via-[#0B5C5B] to-[#1D3C44] bg-clip-text text-transparent mb-2">
            Dashboard PlHealth
          </div>
          <p className="text-sm text-muted-foreground">
            Todos os direitos reservados © 2025
          </p>
        </div>
      </div>
    </footer>
  )
}