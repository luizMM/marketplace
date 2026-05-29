import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { cn } from '@/lib/utils'
import { useUser } from '@/context/UserContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function ShoppingCartIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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

const rarityColors = {
  comum: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  raro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epico: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  lendario: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, updateBalance } = useUser()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setPurchasing(true)
    setPurchaseError('')
    try {
      const res = await fetch(`${API_URL}/purchase?buyer_id=${user.id}&item_id=${item.id}`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        setPurchaseError(data.detail || 'Erro ao realizar compra')
        return
      }
      updateBalance(data.new_balance)
      setPurchaseSuccess(true)
    } catch {
      setPurchaseError('Erro de conexao com o servidor')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </main>
      </div>
    )
  }

  if (!item || item.detail) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground">Item nao encontrado</h1>
          <p className="mt-2 text-muted-foreground">O item que voce procura nao existe ou foi removido.</p>
          <Link to="/marketplace" className="mt-4 inline-block text-primary hover:underline">
            Voltar ao Marketplace
          </Link>
        </main>
      </div>
    )
  }

  if (purchaseSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <svg className="h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground">Compra Realizada!</h1>
          <p className="mb-2 text-muted-foreground">
            Voce comprou <strong>{item.name}</strong> por R$ {item.price.toFixed(2).replace('.', ',')}.
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Seu novo saldo: R$ {user?.balance.toFixed(2).replace('.', ',')}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/profile" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Ver Transacoes
            </Link>
            <Link to="/marketplace" className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-secondary px-8 font-semibold text-foreground transition-colors hover:bg-muted">
              Continuar Comprando
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const isOwner = user && item.owner_id === user.id

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="aspect-square overflow-hidden bg-secondary">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=400&fit=crop'}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <div className={cn("rounded-md border px-3 py-1.5 text-sm font-medium capitalize", rarityColors[item.rarity] || rarityColors.comum)}>
                {item.rarity}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="mb-2 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {item.game}
            </span>

            <h1 className="mb-4 text-3xl font-bold text-foreground">{item.name}</h1>

            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">
                R$ {item.price.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {item.description && (
              <div className="mb-6">
                <h2 className="mb-2 text-sm font-semibold text-foreground">Descricao</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            )}

            <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-secondary/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Categoria</p>
                <p className="font-medium text-foreground">{item.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Condicao</p>
                <p className="font-medium text-foreground">{item.condition}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Raridade</p>
                <p className="font-medium capitalize text-foreground">{item.rarity}</p>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.seller}</p>
                <p className="text-sm text-muted-foreground">Vendedor verificado</p>
              </div>
              <ShieldCheckIcon className="h-6 w-6 text-primary" />
            </div>

            {purchaseError && (
              <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {purchaseError}
              </div>
            )}

            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              {isOwner ? (
                <div className="flex h-14 flex-1 items-center justify-center rounded-xl border border-border bg-secondary text-base font-semibold text-muted-foreground">
                  Voce ja possui este item
                </div>
              ) : (
                <button
                  onClick={handleBuyNow}
                  disabled={purchasing}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {purchasing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="h-5 w-5" />
                      {user ? 'Comprar Agora' : 'Entrar para Comprar'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
