import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import ItemCard from '@/components/ItemCard'
import CategoryCard from '@/components/CategoryCard'

// Icons
function SwordIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" x2="19" y1="19" y2="13" />
      <line x1="16" x2="20" y1="16" y2="20" />
      <line x1="19" x2="21" y1="21" y2="19" />
    </svg>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}

function PaletteIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
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

function SparklesIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}

function CarIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

const categories = [
  { name: 'Armas', icon: SwordIcon, count: 1234 },
  { name: 'Armaduras', icon: ShieldIcon, count: 856 },
  { name: 'Skins', icon: PaletteIcon, count: 2341 },
  { name: 'Personagens', icon: UserIcon, count: 432 },
  { name: 'Efeitos', icon: SparklesIcon, count: 678 },
  { name: 'Veiculos', icon: CarIcon, count: 321 },
]

const featuredItems = [
  {
    id: 1,
    name: 'Dragon Lore AWP',
    game: 'CS2',
    price: 8500.00,
    originalPrice: 10000.00,
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=400&fit=crop',
    rarity: 'lendario',
    seller: 'ProTrader',
  },
  {
    id: 2,
    name: 'Reaver Vandal',
    game: 'Valorant',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
    rarity: 'epico',
    seller: 'SkinMaster',
  },
  {
    id: 3,
    name: 'Renegade Raider',
    game: 'Fortnite',
    price: 1200.00,
    originalPrice: 1500.00,
    image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=400&fit=crop',
    rarity: 'lendario',
    seller: 'RareSkins',
  },
  {
    id: 4,
    name: 'Karambit Fade',
    game: 'CS2',
    price: 3200.00,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop',
    rarity: 'epico',
    seller: 'KnifeKing',
  },
]

const recentItems = [
  {
    id: 5,
    name: 'M4A4 Howl',
    game: 'CS2',
    price: 4500.00,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0d?w=400&h=400&fit=crop',
    rarity: 'lendario',
    seller: 'LegendTrader',
  },
  {
    id: 6,
    name: 'Phantom Oni',
    game: 'Valorant',
    price: 320.00,
    originalPrice: 400.00,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop',
    rarity: 'raro',
    seller: 'ValPlayer',
  },
  {
    id: 7,
    name: 'Galaxy Skin',
    game: 'Fortnite',
    price: 890.00,
    image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=400&fit=crop',
    rarity: 'epico',
    seller: 'FortMaster',
  },
  {
    id: 8,
    name: 'Sport Gloves',
    game: 'CS2',
    price: 1800.00,
    originalPrice: 2200.00,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop',
    rarity: 'raro',
    seller: 'GlovePro',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                O Marketplace de{' '}
                <span className="text-primary">Ativos Gaming</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                Compre e venda skins, itens e ativos de jogos com seguranca. 
                Milhares de itens dos seus jogos favoritos em um so lugar.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link 
                  to="/marketplace"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explorar Marketplace
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <button className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-secondary px-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                  Vender Itens
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Categorias</h2>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                Ver todas
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <CategoryCard key={category.name} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Items Section */}
        <section className="border-t border-border bg-secondary/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Itens em Destaque</h2>
                <p className="mt-1 text-sm text-muted-foreground">Os itens mais procurados do momento</p>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                Ver todos
              </a>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Items Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Adicionados Recentemente</h2>
                <p className="mt-1 text-sm text-muted-foreground">Novos itens no marketplace</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  Todos
                </button>
                <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  CS2
                </button>
                <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Valorant
                </button>
                <button className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Fortnite
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentItems.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t border-border bg-secondary/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="mt-1 text-sm text-muted-foreground">Itens Listados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">25K+</p>
                <p className="mt-1 text-sm text-muted-foreground">Usuarios Ativos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">R$ 2M+</p>
                <p className="mt-1 text-sm text-muted-foreground">Em Transacoes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="mt-1 text-sm text-muted-foreground">Jogos Suportados</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Marketplace</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Todos os Itens</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Categorias</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Ofertas</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Conta</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Meu Perfil</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Meus Itens</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Historico</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Suporte</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Central de Ajuda</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Contato</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Termos de Uso</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacidade</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 GameVault. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
