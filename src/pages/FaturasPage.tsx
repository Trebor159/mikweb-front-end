import { useState } from 'react'
import { FileText, Copy, QrCode, ExternalLink, Check } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { faturaService, FaturaDetalhe } from '../services/api'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PageLoader, Spinner } from '../components/ui/Spinner'
import { Alert } from '../components/ui/Alert'

function formatarMoeda(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}
function formatarData(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

// ─── Modal de detalhes da fatura ──────────────────────────
function ModalFatura({ faturaId, onClose }: { faturaId: string; onClose: () => void }) {
  const { data: fatura, isLoading, erro } = useApi<FaturaDetalhe>(
    () => faturaService.detalhe(faturaId),
    [faturaId]
  )
  const [copiado, setCopiado] = useState<'pix' | 'boleto' | null>(null)

  async function copiar(texto: string, tipo: 'pix' | 'boleto') {
    await navigator.clipboard.writeText(texto)
    setCopiado(tipo)
    setTimeout(() => setCopiado(null), 2000)
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
          <h3 className="font-display font-700 text-white">Detalhes da Fatura</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {isLoading && <div className="flex justify-center py-6"><Spinner size="lg" /></div>}
          {erro && <Alert tipo="erro" mensagem={erro} />}

          {fatura && (
            <>
              {/* Info básica */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Descrição</span>
                  <span className="text-slate-200 text-sm font-medium">{fatura.descricao}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Valor</span>
                  <span className="text-white font-display font-700 text-lg">{formatarMoeda(fatura.valor)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Vencimento</span>
                  <span className="text-slate-200 text-sm">{formatarData(fatura.vencimento)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Status</span>
                  <StatusBadge status={fatura.status} />
                </div>
              </div>

              {/* Pix */}
              {fatura.pix && fatura.status !== 'pago' && (
                <div className="bg-slate-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode size={16} className="text-brand-400" />
                    <p className="text-sm font-medium text-slate-200">Pix Copia e Cola</p>
                  </div>
                  <p className="text-xs text-slate-400 break-all font-mono bg-slate-900/60 p-2.5 rounded-lg mb-3 leading-relaxed">
                    {fatura.pix.slice(0, 80)}...
                  </p>
                  <button
                    onClick={() => copiar(fatura.pix!, 'pix')}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    {copiado === 'pix' ? (
                      <><Check size={15} /> Copiado!</>
                    ) : (
                      <><Copy size={15} /> Copiar código Pix</>
                    )}
                  </button>
                </div>
              )}

              {/* Boleto */}
              {fatura.codigoBarras && fatura.status !== 'pago' && (
                <div className="bg-slate-800/60 rounded-xl p-4">
                  <p className="text-sm font-medium text-slate-200 mb-2">Código de Barras</p>
                  <p className="text-xs text-slate-400 font-mono break-all bg-slate-900/60 p-2.5 rounded-lg mb-3">
                    {fatura.codigoBarras}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copiar(fatura.codigoBarras!, 'boleto')}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm py-2.5"
                    >
                      {copiado === 'boleto' ? <><Check size={15} /> Copiado!</> : <><Copy size={15} /> Copiar</>}
                    </button>
                    {fatura.urlBoleto && (
                      <a
                        href={fatura.urlBoleto}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary flex items-center justify-center gap-2 text-sm py-2.5 px-4"
                      >
                        <ExternalLink size={15} /> PDF
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Pago */}
              {fatura.status === 'pago' && fatura.pagamento && (
                <Alert tipo="sucesso" mensagem={`Pago em ${formatarData(fatura.pagamento)}${fatura.formaPagamento ? ` via ${fatura.formaPagamento}` : ''}`} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────
export function FaturasPage() {
  const { data: faturas, isLoading, erro } = useApi(faturaService.listar)
  const [filtro, setFiltro] = useState<'todas' | 'pendente' | 'pago' | 'vencido'>('todas')
  const [faturaAberta, setFaturaAberta] = useState<string | null>(null)

  const faturasFiltradas = faturas?.filter((f) =>
    filtro === 'todas' ? true : f.status === filtro
  ) ?? []

  const FILTROS: { key: typeof filtro; label: string }[] = [
    { key: 'todas',   label: 'Todas'    },
    { key: 'pendente',label: 'Pendentes'},
    { key: 'vencido', label: 'Vencidas' },
    { key: 'pago',    label: 'Pagas'    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-700 text-white">Faturas</h1>
        <p className="text-slate-400 text-sm mt-1">Gerencie suas faturas e pagamentos</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTROS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              filtro === key
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {erro && <Alert tipo="erro" mensagem={erro} />}

      {isLoading ? (
        <PageLoader />
      ) : faturasFiltradas.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Nenhuma fatura encontrada</p>
        </div>
      ) : (
        <div className="card divide-y divide-slate-800/60">
          {faturasFiltradas.map((fatura) => (
            <button
              key={fatura.id}
              onClick={() => setFaturaAberta(fatura.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-medium">{fatura.descricao}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Vence em {formatarData(fatura.vencimento)}
                    {fatura.temPix && <span className="ml-2 text-brand-400">• Pix disponível</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <StatusBadge status={fatura.status} />
                <p className="text-white font-display font-700">{formatarMoeda(fatura.valor)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {faturaAberta && (
        <ModalFatura faturaId={faturaAberta} onClose={() => setFaturaAberta(null)} />
      )}
    </div>
  )
}
