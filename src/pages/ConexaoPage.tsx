import { Wifi, WifiOff, ArrowDown, ArrowUp, Calendar, Monitor } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { conexaoService } from '../services/api'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PageLoader } from '../components/ui/Spinner'
import { Alert } from '../components/ui/Alert'

function formatarData(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

export function ConexaoPage() {
  const { data: conexao, isLoading, erro, refetch } = useApi(conexaoService.status)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-700 text-white">Conexão</h1>
          <p className="text-slate-400 text-sm mt-1">Status e informações do seu plano</p>
        </div>
        <button onClick={refetch} className="btn-secondary text-sm px-4 py-2">
          Atualizar
        </button>
      </div>

      {erro && <Alert tipo="erro" mensagem={erro} />}
      {isLoading && <PageLoader />}

      {conexao && (
        <>
          {/* Card principal — status */}
          <div className="card p-6 animate-slide-up">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                conexao.status === 'online'
                  ? 'bg-emerald-500/15'
                  : conexao.status === 'suspenso'
                  ? 'bg-red-500/15'
                  : 'bg-slate-700/40'
              }`}>
                {conexao.status === 'online'
                  ? <Wifi size={28} className="text-emerald-400" />
                  : <WifiOff size={28} className="text-red-400" />
                }
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-display font-700 text-white text-xl">
                    {conexao.status === 'online' ? 'Conexão ativa' : conexao.status === 'suspenso' ? 'Conexão suspensa' : 'Sem conexão'}
                  </h2>
                  <StatusBadge status={conexao.status} tipo="conexao" />
                </div>
                <p className="text-slate-400 text-sm">
                  {conexao.status === 'online'
                    ? 'Sua internet está funcionando normalmente.'
                    : conexao.status === 'suspenso'
                    ? 'Pague suas faturas em aberto para reativar.'
                    : 'Verifique seu equipamento ou contate o suporte.'}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de infos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {conexao.plano && (
              <div className="card p-5 animate-slide-up delay-100">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor size={16} className="text-brand-400" />
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Plano</p>
                </div>
                <p className="text-white font-display font-700 text-lg">{conexao.plano}</p>
              </div>
            )}

            {conexao.vencimento && (
              <div className="card p-5 animate-slide-up delay-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-amber-400" />
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Vencimento</p>
                </div>
                <p className="text-white font-display font-700 text-lg">{formatarData(conexao.vencimento)}</p>
              </div>
            )}

            {conexao.download && (
              <div className="card p-5 animate-slide-up delay-300">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowDown size={16} className="text-emerald-400" />
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Download</p>
                </div>
                <p className="text-white font-display font-700 text-lg">{conexao.download}</p>
              </div>
            )}

            {conexao.upload && (
              <div className="card p-5 animate-slide-up delay-400">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUp size={16} className="text-brand-400" />
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Upload</p>
                </div>
                <p className="text-white font-display font-700 text-lg">{conexao.upload}</p>
              </div>
            )}
          </div>

          {/* IP (info técnica) */}
          {conexao.ip && (
            <div className="card p-5 animate-slide-up">
              <p className="text-slate-400 text-xs mb-1">Endereço IP</p>
              <p className="text-slate-300 font-mono text-sm">{conexao.ip}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
