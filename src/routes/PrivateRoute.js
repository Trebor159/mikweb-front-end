import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Envolve rotas que precisam de login.
// Se não estiver autenticado, redireciona para /login.
export function PrivateRoute({ children }) {
    const { token, isLoading } = useAuth();
    // Ainda verificando se tem token no localStorage
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" }) }));
    }
    if (!token)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(_Fragment, { children: children });
}
