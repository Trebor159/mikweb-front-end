import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface AlertProps {
  tipo?: 'erro' | 'sucesso' | 'info'
  mensagem: string
}

export function Alert({ tipo = 'erro', mensagem }: AlertProps) {
  const estilos = {
    erro:    { bg: 'bg-red-500/10 border-red-500/30',   text: 'text-red-400',   Icon: AlertCircle },
    sucesso: { bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-400', Icon: CheckCircle2 },
    info:    { bg: 'bg-brand-500/10 border-brand-500/30', text: 'text-brand-400', Icon: Info },
  }[tipo]

  const { Icon } = estilos

  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border ${estilos.bg} animate-fade-in`}>
      <Icon size={16} className={`${estilos.text} mt-0.5 shrink-0`} />
      <p className={`text-sm ${estilos.text}`}>{mensagem}</p>
    </div>
  )
}
