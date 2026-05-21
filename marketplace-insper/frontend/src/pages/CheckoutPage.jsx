import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '@/components/Header'
import { cn } from '@/lib/utils'

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

function WalletIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}

function PixIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 3L9 7.5l4.5 4.5L9 16.5 13.5 21" />
      <path d="M10.5 3L6 7.5l4.5 4.5L6 16.5 10.5 21" />
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

function CheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
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

function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
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

const paymentMethods = [
  {
    id: 'pix',
    name: 'PIX',
    description: 'Pagamento instantaneo',
    icon: PixIcon,
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
    id: 'wallet',
    name: 'Saldo da Carteira',
    description: 'Saldo disponivel: R$ 1.250,00',
    icon: WalletIcon,
    discount: 0,
  },
  {
    id: 'boleto',
    name: 'Boleto Bancario',
    description: 'Compensacao em ate 3 dias',
    icon: BarcodeIcon,
    discount: 3,
  },
]

// Mock cart items
const cartItems = [
  {
    id: 1,
    name: 'AK-47 | Neon Rider',
    game: 'CS2',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=200&h=200&fit=crop',
    rarity: 'lendario',
  },
  {
    id: 2,
    name: 'Dragon Lore AWP',
    game: 'CS2',
    price: 890.00,
    originalPrice: 1200.00,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop',
    rarity: 'lendario',
  },
]

const rarityColors = {
  comum: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  raro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epico: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  lendario: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [selectedPayment, setSelectedPayment] = useState('pix')
  const [items, setItems] = useState(cartItems)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + item.price, 0)
  const selectedMethod = paymentMethods.find(m => m.id === selectedPayment)
  const discount = selectedMethod?.discount || 0
  const discountValue = (subtotal * discount) / 100
  const total = subtotal - discountValue

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleCheckout = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setCompleted(true)
    }, 2000)
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckIcon className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground">Pagamento Confirmado!</h1>
          <p className="mb-8 text-muted-foreground">
            Sua compra foi realizada com sucesso. Os itens foram adicionados ao seu inventario.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/profile"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ver Minhas Transacoes
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-secondary px-8 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Continuar Comprando
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </button>

        <h1 className="mb-8 text-3xl font-bold text-foreground">Finalizar Compra</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="mb-4 text-lg text-muted-foreground">Seu carrinho esta vazio</p>
            <Link
              to="/marketplace"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explorar Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items & Payment Methods */}
            <div className="space-y-6 lg:col-span-2">
              {/* Cart Items */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Itens no Carrinho ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{item.game}</p>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <span className={cn("inline-block mt-1 rounded-md border px-2 py-0.5 text-xs font-medium capitalize", rarityColors[item.rarity])}>
                          {item.rarity}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                        {item.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Metodo de Pagamento
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={cn(
                        "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all",
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-secondary/50 hover:border-primary/50"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                        selectedPayment === method.id ? "bg-primary/20" : "bg-secondary"
                      )}>
                        <method.icon className={cn(
                          "h-5 w-5",
                          selectedPayment === method.id ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{method.name}</p>
                          {method.discount > 0 && (
                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                              -{method.discount}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      <div className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2",
                        selectedPayment === method.id
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}>
                        {selectedPayment === method.id && (
                          <CheckIcon className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">Desconto ({discount}%)</span>
                      <span className="text-green-400">-R$ {discountValue.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de servico</span>
                    <span className="text-foreground">Gratis</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing || items.length === 0}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <LockIcon className="h-5 w-5" />
                      Finalizar Pagamento
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Pagamento 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
