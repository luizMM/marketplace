import { useState } from 'react'
import { cn } from '@/lib/utils'

function HeartIcon({ className, filled }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

const rarityColors = {
  comum: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  raro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  epico: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  lendario: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export default function ItemCard({
  name,
  game,
  price,
  originalPrice,
  image,
  rarity = 'comum',
  seller,
}) {
  const [isFavorite, setIsFavorite] = useState(false)

  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
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
        <div className={cn("absolute bottom-2 left-2 rounded-md border px-2 py-1 text-xs font-medium capitalize", rarityColors[rarity])}>
          {rarity}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="mb-1 text-xs text-muted-foreground">{game}</p>
        <h3 className="mb-2 truncate text-sm font-semibold text-foreground">{name}</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary">
              R$ {price.toFixed(2).replace('.', ',')}
            </p>
            {originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Vendedor</p>
            <p className="text-xs font-medium text-foreground">{seller}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
