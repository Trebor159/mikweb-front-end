import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Formata CPF enquanto digita: 000.000.000-00
  function formatarCpf(valor: string) {
    const nums = valor.replace(/\D/g, '').slice(0, 11)
    return nums
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setIsLoading(true)
    try {
      await login(cpf.replace(/\D/g, ''), senha)
      navigate('/dashboard')
    } catch {
      setErro('CPF ou senha incorretos. Verifique e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Painel esquerdo — decorativo */}
      <div className="hidden lg:flex w-1/2 relative bg-brand-950 items-center justify-center overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -top-20 -left-20" />
        <div className="absolute w-72 h-72 bg-brand-500/10 rounded-full blur-3xl bottom-10 right-10" />

        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-900/60">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-700 text-white mb-4 leading-tight">
            Internet de<br />alta qualidade
          </h1>
          <p className="text-brand-200/70 text-lg leading-relaxed">
            Gerencie sua conta, faturas e conexão em um só lugar.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-3 text-left">
            {['Pague faturas com Pix em segundos', 'Acompanhe o status da sua conexão', 'Histórico completo de pagamentos'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-brand-500/30 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-brand-400 rounded-full" />
                </div>
                <p className="text-brand-100/80 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-slide-up">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-display font-700 text-white">Meu Provedor</span>
          </div>

          <h2 className="font-display text-2xl font-700 text-white mb-1">Bem-vindo de volta</h2>
          <p className="text-slate-400 text-sm mb-8">Entre com seu CPF e senha para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CPF */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">CPF</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatarCpf(e.target.value))}
                className="input"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {erro && <Alert tipo="erro" mensagem={erro} />}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? <Spinner size="sm" /> : 'Entrar'}
            </button>
          </form>

          <p className="text-slate-500 text-xs text-center mt-8">
            Problemas para entrar? Entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  )
}
