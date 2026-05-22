import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
const AuthContext = createContext(null);
// ─── Provider ─────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Ao abrir o app, tenta restaurar a sessão do localStorage
    useEffect(() => {
        const tokenSalvo = localStorage.getItem('token');
        const usuarioSalvo = localStorage.getItem('usuario');
        if (tokenSalvo && usuarioSalvo) {
            setToken(tokenSalvo);
            setUsuario(JSON.parse(usuarioSalvo));
        }
        setIsLoading(false);
    }, []);
    // Faz login na API e salva token + usuário
    async function login(cpf, senha) {
        const resultado = await authService.login(cpf, senha);
        localStorage.setItem('token', resultado.token);
        localStorage.setItem('usuario', JSON.stringify(resultado.cliente));
        setToken(resultado.token);
        setUsuario(resultado.cliente);
    }
    // Remove tudo e volta para o login
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
    }
    return (_jsx(AuthContext.Provider, { value: { usuario, token, isLoading, login, logout }, children: children }));
}
// ─── Hook ─────────────────────────────────────────────────
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    return ctx;
}
