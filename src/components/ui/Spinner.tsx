export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size]
  return (
    <div className={`${s} border-2 border-brand-500 border-t-transparent rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-slate-400 text-sm animate-pulse">Carregando...</p>
    </div>
  )
}
