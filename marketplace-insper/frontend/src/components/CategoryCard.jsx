export default function CategoryCard({ name, icon: Icon, count }) {
  return (
    <div className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:bg-secondary">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{count} itens</p>
      </div>
    </div>
  )
}
