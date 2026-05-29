import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { cn } from '@/lib/utils'
import { useUser } from '@/context/UserContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function UserIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function HistoryIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

function MailIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

const tabs = [
  { id: 'profile', name: 'Informacoes Pessoais', icon: UserIcon },
  { id: 'transactions', name: 'Transacoes', icon: HistoryIcon },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [transactions, setTransactions] = useState([])
  const [loadingTx, setLoadingTx] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    if (activeTab === 'transactions' && user) {
      setLoadingTx(true)
      fetch(`${API_URL}/users/${user.id}/transactions`)
        .then((res) => res.json())
        .then((data) => {
          setTransactions(Array.isArray(data) ? data : [])
          setLoadingTx(false)
        })
        .catch(() => setLoadingTx(false))
    }
  }, [activeTab, user])

  if (!user) return null

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Meu Perfil</h1>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">{user.username}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Verificado</span>
                </div>
                <div className="mt-3 rounded-lg bg-primary/10 px-4 py-2">
                  <p className="text-xs text-muted-foreground">Saldo</p>
                  <p className="text-lg font-bold text-primary">
                    R$ {user.balance.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-secondary"
                >
                  Sair
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">Informacoes Pessoais</h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Nome de Usuario</label>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{user.username}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Email</label>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
                      <MailIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      R$ {user.balance.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-sm text-muted-foreground">Saldo disponivel</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{user.id}</p>
                    <p className="text-sm text-muted-foreground">ID do usuario</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">Historico de Transacoes</h2>

                {loadingTx ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <HistoryIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhuma transacao ainda</h3>
                    <p className="mb-4 text-sm text-muted-foreground">Explore o marketplace e compre seu primeiro item!</p>
                    <Link to="/marketplace" className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                      Ir ao Marketplace
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={`${tx.type}-${tx.id}`}
                        className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircleIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{tx.item_name}</h3>
                            <span className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                              tx.type === 'compra' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                            )}>
                              {tx.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tx.type === 'compra' ? `Vendedor: ${tx.seller_name}` : 'Venda realizada'}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-lg font-bold", tx.type === 'compra' ? 'text-foreground' : 'text-green-400')}>
                            {tx.type === 'compra' ? '-' : '+'}R$ {tx.amount.toFixed(2).replace('.', ',')}
                          </p>
                          <div className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                            <CheckCircleIcon className="h-3 w-3" />
                            concluida
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
