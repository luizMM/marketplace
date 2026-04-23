import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

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

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function CreditCardIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

function QrCodeIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  )
}

function BarcodeIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5v14" />
      <path d="M8 5v14" />
      <path d="M12 5v14" />
      <path d="M17 5v14" />
      <path d="M21 5v14" />
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

function CheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function LockIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

const paymentMethods = [
  {
    id: 'pix',
    name: 'PIX',
    description: 'Pagamento instantaneo',
    icon: QrCodeIcon,
    discount: 5,
  },
  {
    id: 'credit',
    name: 'Cartao de Credito',
    description: 'Parcele em ate 12x',
    icon: CreditCardIcon,
    discount: 0,
  },
  {
    id: 'boleto',
    name: 'Boleto Bancario',
    description: 'Vencimento em 3 dias',
    icon: BarcodeIcon,
    discount: 0,
  },
  {
    id: 'wallet',
    name: 'Saldo da Carteira',
    description: 'Saldo disponivel: R$ 1.250,00',
    icon: WalletIcon,
    discount: 0,
  },
]

// Itens simulados no carrinho
const cartItems = [
  {
    id: 1,
    name: 'AWP | Dragon Lore',
    game: 'CS2',
    price: 15000.00,
    image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=400&q=80',
    rarity: 'lendario',
  },
  {
    id: 3,
    name: 'AK-47 | Neon Rider',
    game: 'CS2',
    price: 850.00,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b24?w=400&q=80',
    rarity: 'epico',
  },
]

const rarityColors = {
  comum: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  raro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epico: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  lendario: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export default function PaymentPage() {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [items, setItems] = useState(cartItems)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + item.price, 0)
  const discount = selectedMethod ? (paymentMethods.find(m => m.id === selectedMethod)?.discount || 0) : 0
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handlePayment = () => {
    if (!selectedMethod || items.length === 0) return
    
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setCompleted(true)
    }, 2000)
  }

  if (completed) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header Simples */}
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GamepadIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GameVault</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckIcon className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Pagamento Confirmado!</h1>
            <p className="mb-8 text-muted-foreground">
              Seus itens foram adicionados a sua conta com sucesso.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Voltar ao Inicio
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-secondary px-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Simples */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GamepadIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">GameVault</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LockIcon className="h-4 w-4" />
            <span>Pagamento Seguro</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </button>

        <h1 className="mb-8 text-2xl font-bold text-foreground">Finalizar Compra</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Cart Items & Payment Methods */}
          <div className="lg:col-span-2">
            {/* Cart Items */}
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Itens no Carrinho ({items.length})
              </h2>
              
              {items.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">Seu carrinho esta vazio</p>
                  <Link to="/marketplace" className="mt-4 inline-block text-primary hover:underline">
                    Explorar Marketplace
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                        <div className={cn(
                          "absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize",
                          rarityColors[item.rarity]
                        )}>
                          {item.rarity}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{item.game}</p>
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="self-start rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Payment Methods */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Metodo de Pagamento</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const isSelected = selectedMethod === method.id
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={cn(
                        "relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all",
                        isSelected 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className={cn(
                        "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg",
                        isSelected ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{method.name}</h3>
                          {method.discount > 0 && (
                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                              -{method.discount}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <CheckIcon className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Resumo do Pedido</h2>
              
              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                  <span className="text-foreground">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Desconto PIX ({discount}%)</span>
                    <span className="text-green-400">-R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de servico</span>
                  <span className="text-green-400">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedMethod || items.length === 0 || processing}
                className={cn(
                  "flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold transition-all",
                  selectedMethod && items.length > 0 && !processing
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
                )}
              >
                {processing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processando...
                  </>
                ) : (
                  <>
                    <LockIcon className="h-5 w-5" />
                    Finalizar Pagamento
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Ao finalizar, voce concorda com nossos Termos de Uso e Politica de Privacidade
              </p>

              {/* Security Badges */}
              <div className="mt-6 flex items-center justify-center gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LockIcon className="h-3.5 w-3.5" />
                  <span>SSL Seguro</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckIcon className="h-3.5 w-3.5" />
                  <span>Compra Protegida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
