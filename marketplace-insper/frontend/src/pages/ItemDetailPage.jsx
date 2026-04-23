import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { allItems } from '@/data/items'
import { cn } from '@/lib/utils'

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function HeartIcon({ className, filled }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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

function CheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ShareIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
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
  const [isFavorite, setIsFavorite] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const item = allItems.find((i) => i.id === parseInt(id))

  if (!item) {
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

  const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const relatedItems = allItems
    .filter((i) => i.id !== item.id && (i.game === item.game || i.rarity === item.rarity))
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="aspect-square overflow-hidden bg-secondary">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {discount > 0 && (
                <div className="rounded-md bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">
                  -{discount}%
                </div>
              )}
              <div className={cn("rounded-md border px-3 py-1.5 text-sm font-medium capitalize", rarityColors[item.rarity])}>
                {item.rarity}
              </div>
            </div>

            {/* Actions */}
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="rounded-full bg-background/80 p-3 backdrop-blur-sm transition-colors hover:bg-background"
              >
                <HeartIcon 
                  className={cn("h-5 w-5", isFavorite ? "text-red-500" : "text-muted-foreground")} 
                  filled={isFavorite}
                />
              </button>
              <button className="rounded-full bg-background/80 p-3 backdrop-blur-sm transition-colors hover:bg-background">
                <ShareIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            {/* Game Badge */}
            <span className="mb-2 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {item.game}
            </span>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-foreground">{item.name}</h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </span>
                {item.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="mt-1 text-sm text-primary">
                  Voce economiza R$ {(item.originalPrice - item.price).toFixed(2).replace('.', ',')}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-semibold text-foreground">Descricao</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>

            {/* Details Grid */}
            <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-secondary/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Categoria</p>
                <p className="font-medium text-foreground">{item.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Condicao</p>
                <p className="font-medium text-foreground">{item.condition}</p>
              </div>
              {item.float && (
                <div>
                  <p className="text-xs text-muted-foreground">Float Value</p>
                  <p className="font-medium text-foreground">{item.float}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Raridade</p>
                <p className="font-medium capitalize text-foreground">{item.rarity}</p>
              </div>
            </div>

            {/* Seller Info */}
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

            {/* Action Buttons */}
            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={cn(
                  "flex h-14 flex-1 items-center justify-center gap-2 rounded-xl text-base font-semibold transition-all",
                  addedToCart 
                    ? "bg-green-600 text-white" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {addedToCart ? (
                  <>
                    <CheckIcon className="h-5 w-5" />
                    Adicionado ao Carrinho
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-5 w-5" />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
              <button className="flex h-14 items-center justify-center rounded-xl border border-border bg-secondary px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted">
                Comprar Agora
              </button>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Itens Relacionados</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  to={`/item/${relatedItem.id}`}
                  className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <img
                      src={relatedItem.image}
                      alt={relatedItem.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className={cn("absolute bottom-2 left-2 rounded-md border px-2 py-1 text-xs font-medium capitalize", rarityColors[relatedItem.rarity])}>
                      {relatedItem.rarity}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="mb-1 text-xs text-muted-foreground">{relatedItem.game}</p>
                    <h3 className="mb-2 truncate text-sm font-semibold text-foreground">{relatedItem.name}</h3>
                    <p className="text-lg font-bold text-primary">
                      R$ {relatedItem.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
