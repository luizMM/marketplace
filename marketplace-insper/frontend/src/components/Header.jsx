import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

// Icons
function GamepadIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function WalletIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function MenuIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function BellIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    setUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GamepadIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">GameVault</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Marketplace
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Categorias
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Vender
          </a>
        </nav>

        {/* Search Bar */}
        <div className="hidden flex-1 justify-center px-8 lg:flex">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar itens, skins, jogos..."
              className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Wallet Balance */}
          <div className="hidden items-center gap-2 rounded-lg bg-secondary px-3 py-2 sm:flex">
            <WalletIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">R$ 1.250,00</span>
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-secondary"
            >
              <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=gaming"
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <ChevronDownIcon className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg">
                <div className="border-b border-border px-3 py-2">
                  <p className="text-sm font-medium text-foreground">Player123</p>
                  <p className="text-xs text-muted-foreground">player@email.com</p>
                </div>
                <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
                  Meu Perfil
                </a>
                <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
                  Meus Itens
                </a>
                <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
                  Transacoes
                </a>
                <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
                  Configuracoes
                </a>
                <div className="border-t border-border pt-1">
                  <button 
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-secondary"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar itens..."
                className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <a href="#" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Marketplace
            </a>
            <a href="#" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary">
              Categorias
            </a>
            <a href="#" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary">
              Vender
            </a>
          </nav>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <WalletIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">R$ 1.250,00</span>
          </div>
        </div>
      )}
    </header>
  )
}
