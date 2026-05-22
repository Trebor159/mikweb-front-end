import { Link } from 'react-router-dom'
import { FileText, Wifi, TrendingUp, ChevronRight, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import { conexaoService, faturaService, Fatura, StatusConexao } from '../services/api'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PageLoader } from '../components/ui/Spinner'

// Formata valor em R$
function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

// Formata data no padrão brasileiro
function formatarData(data: string) {
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

export function DashboardPage() {
  const { usuario } = useAuth()

  const {
    data,
    isLoading: loadingFaturas,
  } = useApi<Fatura[]>(faturaService.listar)

  const faturas = data ?? []

  const {
  data: conexao,
  isLoading: loadingConexao,
} = useApi<StatusConexao>(conexaoService.status)

  const primeiroNome = usuario?.nome?.split(' ')[0] ?? ''

  const faturasPendentes = faturas.filter(
    (f: Fatura) =>
      f.status === 'pendente' || f.status === 'vencido'
  )

  const ultimaFatura = faturas[0] ?? null

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Saudação */}
      <div>
        <p className="text-slate-400 text-sm">Olá, bem-vindo 👋</p>
        <h1 className="font-display text-3xl font-700 text-white mt-1">
          {primeiroNome}
        </h1>
      </div>

      {/* Alerta de faturas vencidas */}
      {faturasPendentes.some(
        (f: Fatura) => f.status === 'vencido'
      ) && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl animate-slide-up">
          <AlertTriangle
            size={18}
            className="text-red-400 mt-0.5 shrink-0"
          />

          <div>
            <p className="text-red-300 font-medium text-sm">
              Você tem fatura(s) vencida(s)
            </p>

            <p className="text-red-400/70 text-xs mt-0.5">
              Regularize para evitar suspensão da conexão.
            </p>
          </div>

          <Link
            to="/faturas"
            className="ml-auto text-xs text-red-400 hover:text-red-300 font-medium whitespace-nowrap"
          >
            Ver faturas →
          </Link>
        </div>
      )}

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Status da conexão */}
        <div className="card p-5 animate-slide-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center">
              <Wifi size={19} className="text-brand-400" />
            </div>

            {conexao && (
              <StatusBadge
                status={conexao.status}
                tipo="conexao"
              />
            )}
          </div>

          {loadingConexao ? (
            <div className="h-8 bg-slate-800 rounded-lg animate-pulse" />
          ) : (
            <>
              <p className="text-slate-400 text-xs mb-1">
                Plano contratado
              </p>

              <p className="text-white font-display font-700 text-lg leading-tight">
                {conexao?.plano ?? '—'}
              </p>

              {conexao?.vencimento && (
                <p className="text-slate-500 text-xs mt-2">
                  Vence em {formatarData(conexao.vencimento)}
                </p>
              )}
            </>
          )}
        </div>

        {/* Última fatura */}
        <div className="card p-5 animate-slide-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center">
              <FileText size={19} className="text-amber-400" />
            </div>

            {ultimaFatura && (
              <StatusBadge status={ultimaFatura.status} />
            )}
          </div>

          {loadingFaturas ? (
            <div className="h-8 bg-slate-800 rounded-lg animate-pulse" />
          ) : ultimaFatura ? (
            <>
              <p className="text-slate-400 text-xs mb-1">
                Última fatura
              </p>

              <p className="text-white font-display font-700 text-2xl">
                {formatarMoeda(ultimaFatura.valor)}
              </p>

              <p className="text-slate-500 text-xs mt-2">
                Vence em {formatarData(ultimaFatura.vencimento)}
              </p>
            </>
          ) : (
            <p className="text-slate-400 text-sm">
              Nenhuma fatura
            </p>
          )}
        </div>

        {/* Total pendente */}
        <div className="card p-5 animate-slide-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center">
              <TrendingUp size={19} className="text-emerald-400" />
            </div>
          </div>

          {loadingFaturas ? (
            <div className="h-8 bg-slate-800 rounded-lg animate-pulse" />
          ) : (
            <>
              <p className="text-slate-400 text-xs mb-1">
                Em aberto
              </p>

              <p className="text-white font-display font-700 text-2xl">
                {formatarMoeda(
                  faturasPendentes.reduce(
                    (s: number, f: Fatura) => s + f.valor,
                    0
                  )
                )}
              </p>

              <p className="text-slate-500 text-xs mt-2">
                {faturasPendentes.length} fatura(s) pendente(s)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Faturas recentes */}
      <div className="card animate-slide-up delay-400">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
          <h2 className="font-display font-700 text-white">
            Faturas recentes
          </h2>

          <Link
            to="/faturas"
            className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1 transition-colors"
          >
            Ver todas <ChevronRight size={15} />
          </Link>
        </div>

        {loadingFaturas ? (
          <PageLoader />
        ) : faturas.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {faturas
              .slice(0, 4)
              .map((fatura: Fatura) => (
                <Link
                  key={fatura.id}
                  to={`/faturas/${fatura.id}`}
                  className="flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors"
                >
                  <div>
                    <p className="text-slate-200 text-sm font-medium">
                      {fatura.descricao}
                    </p>

                    <p className="text-slate-500 text-xs mt-0.5">
                      Vence em{' '}
                      {formatarData(fatura.vencimento)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={fatura.status} />

                    <p className="text-white font-display font-700">
                      {formatarMoeda(fatura.valor)}
                    </p>

                    <ChevronRight
                      size={15}
                      className="text-slate-600"
                    />
                  </div>
                </Link>
              ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-slate-500 text-sm">
              Nenhuma fatura encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  )
}