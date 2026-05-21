import { useState, FormEvent } from 'react'
import { User, Lock, Phone, Mail, Eye, EyeOff, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import { clienteService } from '../services/api'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'

export function PerfilPage() {
  const { usuario, logout } = useAuth()
  const { data: suporte } = useApi(clienteService.suporte)

  // Estado do formulário de troca de senha
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenhas, setMostrarSenhas] = useState(false)
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [alertaSenha, setAlertaSenha] = useState<{ tipo: 'sucesso' | 'erro'; msg: string } | null>(null)

  async function handleTrocarSenha(e: FormEvent) {
    e.preventDefault()
    setAlertaSenha(null)

    if (novaSenha !== confirmarSenha) {
      setAlertaSenha({ tipo: 'erro', msg: 'As senhas não coincidem.' })
      return
    }
    if (novaSenha.length < 6) {
      setAlertaSenha({ tipo: 'erro', msg: 'A nova senha deve ter no mínimo 6 caracteres.' })
      return
    }

    setLoadingSenha(true)
    try {
      await clienteService.trocarSenha(senhaAtual, novaSenha)
      setAlertaSenha({ tipo: 'sucesso', msg: 'Senha alterada com sucesso!' })
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
    } catch {
      setAlertaSenha({ tipo: 'erro', msg: 'Senha atual incorreta ou erro ao salvar.' })
    } finally {
      setLoadingSenha(false)
    }
  }

  function formatarCpf(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-700 text-white">Perfil</h1>
        <p className="text-slate-400 text-sm mt-1">Seus dados e configurações de conta</p>
      </div>

      {/* Dados do cliente */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-brand-600/20 rounded-2xl flex items-center justify-center">
            <User size={24} className="text-brand-400" />
          </div>
          <div>
            <h2 className="font-display font-700 text-white text-lg">{usuario?.nome}</h2>
            <p className="text-slate-400 text-sm">Cliente ativo</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl">
            <User size={15} className="text-slate-500 shrink-0" />
            <div>
              <p className="text-slate-500 text-xs">CPF</p>
              <p className="text-slate-200 text-sm font-mono">{formatarCpf(usuario?.cpf ?? '')}</p>
            </div>
          </div>

          {usuario?.email && (
            <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl">
              <Mail size={15} className="text-slate-500 shrink-0" />
              <div>
                <p className="text-slate-500 text-xs">E-mail</p>
                <p className="text-slate-200 text-sm">{usuario.email}</p>
              </div>
            </div>
          )}

          {usuario?.celular && (
            <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl">
              <Phone size={15} className="text-slate-500 shrink-0" />
              <div>
                <p className="text-slate-500 text-xs">Celular</p>
                <p className="text-slate-200 text-sm">{usuario.celular}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alterar senha */}
      <div className="card p-6 animate-slide-up delay-100">
        <div className="flex items-center gap-3 mb-5">
          <Lock size={18} className="text-brand-400" />
          <h3 className="font-display font-700 text-white">Alterar Senha</h3>
        </div>

        <form onSubmit={handleTrocarSenha} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Senha atual</label>
            <div className="relative">
              <input
                type={mostrarSenhas ? 'text' : 'password'}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="input pr-11"
                placeholder="••••••"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenhas(!mostrarSenhas)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {mostrarSenhas ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nova senha</label>
            <input
              type={mostrarSenhas ? 'text' : 'password'}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="input"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirmar nova senha</label>
            <input
              type={mostrarSenhas ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="input"
              placeholder="Repita a nova senha"
              required
            />
          </div>

          {alertaSenha && <Alert tipo={alertaSenha.tipo} mensagem={alertaSenha.msg} />}

          <button
            type="submit"
            disabled={loadingSenha}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {loadingSenha ? <Spinner size="sm" /> : 'Salvar nova senha'}
          </button>
        </form>
      </div>

      {/* Suporte */}
      {suporte && (
        <div className="card p-5 animate-slide-up delay-200">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle size={18} className="text-emerald-400" />
            <h3 className="font-display font-700 text-white">Suporte</h3>
          </div>
          <p className="text-slate-400 text-sm mb-4">Precisa de ajuda? Fale com nossa equipe pelo WhatsApp.</p>
          <a
            href={suporte.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <MessageCircle size={16} />
            Abrir WhatsApp
          </a>
        </div>
      )}

      {/* Logout */}
      <div className="card p-5 animate-slide-up delay-300">
        <p className="text-slate-400 text-sm mb-4">Quer sair da sua conta?</p>
        <button
          onClick={logout}
          className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors border border-red-500/25"
        >
          Sair da conta
        </button>
      </div>
    </div>
  )
}
