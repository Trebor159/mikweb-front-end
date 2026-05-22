import axios from 'axios';
// Cria a instância do Axios apontando para o backend no Railway
const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});
// ─── Interceptor de REQUEST ────────────────────────────────
// Antes de cada requisição, lê o token salvo e coloca no header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// ─── Interceptor de RESPONSE ──────────────────────────────
// Se receber 401 (token expirado/inválido), desloga e vai pro login
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// ─── Funções de chamada à API ──────────────────────────────
export const authService = {
    async login(cpf, senha) {
        const { data } = await api.post('/api/auth/login', { cpf, senha });
        return data;
    },
};
export const faturaService = {
    async listar() {
        const { data } = await api.get('/api/faturas');
        return data;
    },
    async detalhe(id) {
        const { data } = await api.get(`/api/faturas/${id}`);
        return data;
    },
    async pix(id) {
        const { data } = await api.get(`/api/faturas/${id}/pix`);
        return data.pix;
    },
};
export const clienteService = {
    async perfil() {
        const { data } = await api.get('/api/cliente/perfil');
        return data;
    },
    async trocarSenha(senhaAtual, novaSenha) {
        await api.put('/api/cliente/senha', { senhaAtual, novaSenha });
    },
    async suporte() {
        const { data } = await api.get('/api/cliente/suporte');
        return data;
    },
};
export const conexaoService = {
    async status() {
        const { data } = await api.get('/api/conexao');
        return data;
    },
};
export default api;
