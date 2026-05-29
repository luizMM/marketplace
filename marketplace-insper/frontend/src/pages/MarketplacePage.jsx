import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import { cn } from '@/lib/utils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
  return (
    <Link
      to={`/item/${item.id}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=400&fit=crop'}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={cn("absolute bottom-2 left-2 rounded-md border px-2 py-1 text-xs font-medium capitalize", rarityColors[item.rarity] || rarityColors.comum)}>
          {item.rarity}
        </div>
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs text-muted-foreground">{item.game}</p>
        <h3 className="mb-2 truncate text-sm font-semibold text-foreground">{item.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            R$ {item.price.toFixed(2).replace('.', ',')}
          </p>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Vendedor</p>
            <p className="text-xs font-medium text-foreground">{item.seller}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

const ALL_GAMES = ['Todos', 'CS2', 'Valorant', 'Fortnite']
const ALL_RARITIES = ['Todos', 'comum', 'raro', 'epico', 'lendario']

export default function MarketplacePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState('Todos')
  const [selectedRarity, setSelectedRarity] = useState('Todos')
  const [sortBy, setSortBy] = useState('recentes')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.game.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGame = selectedGame === 'Todos' || item.game === selectedGame
    const matchesRarity = selectedRarity === 'Todos' || item.rarity === selectedRarity
    return matchesSearch && matchesGame && matchesRarity
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'preco-menor') return a.price - b.price
    if (sortBy === 'preco-maior') return b.price - a.price
    if (sortBy === 'nome') return a.name.localeCompare(b.name)
    return b.id - a.id
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
          <p className="mt-2 text-muted-foreground">
            Encontre os melhores itens dos seus jogos favoritos
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
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

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {ALL_GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>

            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm capitalize text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {ALL_RARITIES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
            </select>

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

            <div className="flex items-center rounded-lg border border-border bg-secondary p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn("rounded-md p-2 transition-colors", viewMode === 'grid' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <GridIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn("rounded-md p-2 transition-colors", viewMode === 'list' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Carregando...' : `${sortedItems.length} ${sortedItems.length === 1 ? 'item encontrado' : 'itens encontrados'}`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : sortedItems.length > 0 ? (
          <div className={cn("grid gap-6", viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
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
