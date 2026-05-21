import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import { cn } from '@/lib/utils'

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

function PackageIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
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

function CalendarIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
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

function EditIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    </svg>
  )
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
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

function ClockIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function XCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

function TruckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

const tabs = [
  { id: 'profile', name: 'Informacoes Pessoais', icon: UserIcon },
  { id: 'transactions', name: 'Transacoes', icon: HistoryIcon },
  { id: 'tracking', name: 'Acompanhar Pedidos', icon: PackageIcon },
]

const transactions = [
  {
    id: 'TRX-001',
    date: '15/01/2024',
    item: 'AK-47 | Neon Rider',
    game: 'CS2',
    type: 'compra',
    amount: 450.00,
    status: 'concluida',
    image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=100&h=100&fit=crop',
  },
  {
    id: 'TRX-002',
    date: '12/01/2024',
    item: 'Dragon Lore AWP',
    game: 'CS2',
    type: 'compra',
    amount: 890.00,
    status: 'concluida',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
  },
  {
    id: 'TRX-003',
    date: '10/01/2024',
    item: 'Vandal Prime',
    game: 'Valorant',
    type: 'venda',
    amount: 320.00,
    status: 'concluida',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop',
  },
  {
    id: 'TRX-004',
    date: '08/01/2024',
    item: 'M4A4 | Howl',
    game: 'CS2',
    type: 'compra',
    amount: 1250.00,
    status: 'pendente',
    image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=100&h=100&fit=crop',
  },
  {
    id: 'TRX-005',
    date: '05/01/2024',
    item: 'Butterfly Knife | Fade',
    game: 'CS2',
    type: 'compra',
    amount: 2100.00,
    status: 'cancelada',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
  },
]

const orders = [
  {
    id: 'ORD-001',
    date: '15/01/2024',
    items: [
      { name: 'AK-47 | Neon Rider', image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=100&h=100&fit=crop' },
    ],
    status: 'entregue',
    total: 450.00,
    steps: [
      { name: 'Pedido realizado', date: '15/01/2024 14:30', completed: true },
      { name: 'Pagamento confirmado', date: '15/01/2024 14:32', completed: true },
      { name: 'Item transferido', date: '15/01/2024 14:35', completed: true },
      { name: 'Entregue', date: '15/01/2024 14:35', completed: true },
    ],
  },
  {
    id: 'ORD-002',
    date: '08/01/2024',
    items: [
      { name: 'M4A4 | Howl', image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=100&h=100&fit=crop' },
    ],
    status: 'processando',
    total: 1250.00,
    steps: [
      { name: 'Pedido realizado', date: '08/01/2024 10:15', completed: true },
      { name: 'Pagamento confirmado', date: '08/01/2024 10:20', completed: true },
      { name: 'Item transferido', date: null, completed: false },
      { name: 'Entregue', date: null, completed: false },
    ],
  },
]

const statusColors = {
  concluida: 'text-green-400 bg-green-500/20',
  pendente: 'text-amber-400 bg-amber-500/20',
  cancelada: 'text-red-400 bg-red-500/20',
  entregue: 'text-green-400 bg-green-500/20',
  processando: 'text-amber-400 bg-amber-500/20',
}

const statusIcons = {
  concluida: CheckCircleIcon,
  pendente: ClockIcon,
  cancelada: XCircleIcon,
  entregue: CheckCircleIcon,
  processando: ClockIcon,
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [expandedOrder, setExpandedOrder] = useState(null)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Meu Perfil</h1>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6">
              {/* User Info */}
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=gaming"
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Player123</h2>
                <p className="text-sm text-muted-foreground">player@email.com</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Verificado</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Informacoes Pessoais</h2>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    <EditIcon className="h-4 w-4" />
                    Editar
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Nome Completo</label>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">Joao Silva</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Email</label>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
                      <MailIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">player@email.com</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Nome de Usuario</label>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">Player123</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Membro Desde</label>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">Janeiro de 2023</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">47</p>
                    <p className="text-sm text-muted-foreground">Compras</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">Vendas</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">R$ 8.450</p>
                    <p className="text-sm text-muted-foreground">Total Transacionado</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">Historico de Transacoes</h2>

                <div className="space-y-4">
                  {transactions.map((transaction) => {
                    const StatusIcon = statusIcons[transaction.status]
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                      >
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                          <img
                            src={transaction.image}
                            alt={transaction.item}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{transaction.item}</h3>
                            <span className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                              transaction.type === 'compra' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                            )}>
                              {transaction.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {transaction.game} - {transaction.date}
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.id}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-lg font-bold",
                            transaction.type === 'compra' ? 'text-foreground' : 'text-green-400'
                          )}>
                            {transaction.type === 'compra' ? '-' : '+'}R$ {transaction.amount.toFixed(2).replace('.', ',')}
                          </p>
                          <div className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                            statusColors[transaction.status]
                          )}>
                            <StatusIcon className="h-3 w-3" />
                            {transaction.status}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tracking Tab */}
            {activeTab === 'tracking' && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">Acompanhar Pedidos</h2>

                <div className="space-y-4">
                  {orders.map((order) => {
                    const StatusIcon = statusIcons[order.status]
                    const isExpanded = expandedOrder === order.id

                    return (
                      <div
                        key={order.id}
                        className="overflow-hidden rounded-lg border border-border bg-secondary/50"
                      >
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-secondary"
                        >
                          <div className="flex -space-x-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="h-12 w-12 overflow-hidden rounded-lg border-2 border-background bg-secondary"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{order.id}</h3>
                              <div className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                                statusColors[order.status]
                              )}>
                                <StatusIcon className="h-3 w-3" />
                                {order.status}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} item(s) - {order.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">
                              R$ {order.total.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                          <ChevronRightIcon className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform",
                            isExpanded && "rotate-90"
                          )} />
                        </button>

                        {isExpanded && (
                          <div className="border-t border-border p-4">
                            <h4 className="mb-4 text-sm font-semibold text-foreground">Status do Pedido</h4>
                            <div className="relative">
                              {order.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 pb-6 last:pb-0">
                                  <div className="relative flex flex-col items-center">
                                    <div className={cn(
                                      "flex h-8 w-8 items-center justify-center rounded-full",
                                      step.completed ? "bg-primary" : "bg-secondary"
                                    )}>
                                      {step.completed ? (
                                        <CheckCircleIcon className="h-5 w-5 text-primary-foreground" />
                                      ) : (
                                        <ClockIcon className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    {idx < order.steps.length - 1 && (
                                      <div className={cn(
                                        "absolute top-8 h-full w-0.5",
                                        step.completed ? "bg-primary" : "bg-border"
                                      )} />
                                    )}
                                  </div>
                                  <div className="flex-1 pt-1">
                                    <p className={cn(
                                      "font-medium",
                                      step.completed ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                      {step.name}
                                    </p>
                                    {step.date && (
                                      <p className="text-sm text-muted-foreground">{step.date}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
