import axios from 'axios'

// Cria a instância do Axios apontando para o backend no Railway
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Interceptor de REQUEST ────────────────────────────────
// Antes de cada requisição, lê o token salvo e coloca no header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Interceptor de RESPONSE ──────────────────────────────
// Se receber 401 (token expirado/inválido), desloga e vai pro login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Tipos retornados pela API ─────────────────────────────

export interface Usuario {
  id: string
  nome: string
  cpf: string
  email?: string
  celular?: string
}

export interface Fatura {
  id: string
  descricao: string
  valor: number
  vencimento: string
  pagamento: string | null
  status: 'pago' | 'pendente' | 'vencido'
  temPix: boolean
  temBoleto: boolean
  urlBoleto: string | null
}

export interface FaturaDetalhe extends Fatura {
  pix: string | null
  codigoBarras: string | null
  formaPagamento: string | null
}

export interface StatusConexao {
  status: 'online' | 'suspenso' | 'offline'
  plano: string | null
  download: string | null
  upload: string | null
  vencimento: string | null
  ip: string | null
}

// ─── Funções de chamada à API ──────────────────────────────

export const authService = {
  async login(cpf: string, senha: string) {

    if (cpf === '12345678900' && senha === '123456') {
      return {
        token: 'token-fake',
        cliente: {
          id: '1',
          nome: 'Robert Santos',
          cpf: '12345678900',
          email: 'teste@teste.com',
          celular: '(98) 99999-9999',
        },
      }
    }

    throw new Error('CPF ou senha inválidos')
  },
}

export const faturaService = {
  async listar() {
    const { data } = await api.get<Fatura[]>('/api/faturas')
    return data
  },
  async detalhe(id: string) {
    const { data } = await api.get<FaturaDetalhe>(`/api/faturas/${id}`)
    return data
  },
  async pix(id: string) {
    const { data } = await api.get<{ pix: string }>(`/api/faturas/${id}/pix`)
    return data.pix
  },
}

export const clienteService = {
  async perfil() {
    const { data } = await api.get<Usuario>('/api/cliente/perfil')
    return data
  },
  async trocarSenha(senhaAtual: string, novaSenha: string) {
    await api.put('/api/cliente/senha', { senhaAtual, novaSenha })
  },
  async suporte() {
    const { data } = await api.get<{ whatsapp: string; link: string }>('/api/cliente/suporte')
    return data
  },
}

export const conexaoService = {
  async status() {
    const { data } = await api.get<StatusConexao>('/api/conexao')
    return data
  },
}

export default api
