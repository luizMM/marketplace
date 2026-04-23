import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import { allItems, games } from '@/data/items'
import { cn } from '@/lib/utils'

function SearchIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function FilterIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

function GridIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}

function ListIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}

const rarityColors = {
  comum: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  raro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epico: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  lendario: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

function MarketplaceItemCard({ item }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0

  return (
    <Link 
      to={`/item/${item.id}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsFavorite(!isFavorite)
          }}
          className="absolute right-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
        >
          <HeartIcon 
            className={cn("h-4 w-4", isFavorite ? "text-red-500" : "text-muted-foreground")} 
            filled={isFavorite}
          />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
            -{discount}%
          </div>
        )}

        {/* Rarity Badge */}
        <div className={cn("absolute bottom-2 left-2 rounded-md border px-2 py-1 text-xs font-medium capitalize", rarityColors[item.rarity])}>
          {item.rarity}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="mb-1 text-xs text-muted-foreground">{item.game}</p>
        <h3 className="mb-2 truncate text-sm font-semibold text-foreground">{item.name}</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">
              R$ {item.price.toFixed(2).replace('.', ',')}
            </p>
            {item.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                R$ {item.originalPrice.toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Vendedor</p>
            <p className="text-xs font-medium text-foreground">{item.seller}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState('Todos')
  const [selectedRarity, setSelectedRarity] = useState('Todos')
  const [sortBy, setSortBy] = useState('recentes')
  const [viewMode, setViewMode] = useState('grid')

  const rarities = ['Todos', 'comum', 'raro', 'epico', 'lendario']

  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.game.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGame = selectedGame === 'Todos' || item.game === selectedGame
    const matchesRarity = selectedRarity === 'Todos' || item.rarity === selectedRarity
    return matchesSearch && matchesGame && matchesRarity
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'preco-menor':
        return a.price - b.price
      case 'preco-maior':
        return b.price - a.price
      case 'nome':
        return a.name.localeCompare(b.name)
      default:
        return b.id - a.id
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
          <p className="mt-2 text-muted-foreground">
            Encontre os melhores itens dos seus jogos favoritos
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar itens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Game Filter */}
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {games.map((game) => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm capitalize text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {rarities.map((rarity) => (
                <option key={rarity} value={rarity} className="capitalize">{rarity}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="recentes">Mais Recentes</option>
              <option value="preco-menor">Menor Preco</option>
              <option value="preco-maior">Maior Preco</option>
              <option value="nome">Nome A-Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-secondary p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === 'grid' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <GridIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === 'list' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {sortedItems.length} {sortedItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
          </p>
        </div>

        {/* Items Grid */}
        {sortedItems.length > 0 ? (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {sortedItems.map((item) => (
              <MarketplaceItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
            <FilterIcon className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhum item encontrado</h3>
            <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou buscar por outro termo</p>
          </div>
        )}
      </main>
    </div>
  )
}
