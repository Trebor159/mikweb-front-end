import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState(null);
    // Formata CPF enquanto digita: 000.000.000-00
    function formatarCpf(valor) {
        const nums = valor.replace(/\D/g, '').slice(0, 11);
        return nums
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setErro(null);
        setIsLoading(true);
        try {
            await login(cpf.replace(/\D/g, ''), senha);
            navigate('/dashboard');
        }
        catch {
            setErro('CPF ou senha incorretos. Verifique e tente novamente.');
        }
        finally {
            setIsLoading(false);
        }
    }
    return (_jsxs("div", { className: "min-h-screen flex", children: [_jsxs("div", { className: "hidden lg:flex w-1/2 relative bg-brand-950 items-center justify-center overflow-hidden", children: [_jsx("div", { className: "absolute w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -top-20 -left-20" }), _jsx("div", { className: "absolute w-72 h-72 bg-brand-500/10 rounded-full blur-3xl bottom-10 right-10" }), _jsxs("div", { className: "relative z-10 text-center px-12", children: [_jsx("div", { className: "w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-900/60", children: _jsx(Zap, { size: 32, className: "text-white" }) }), _jsxs("h1", { className: "font-display text-4xl font-700 text-white mb-4 leading-tight", children: ["Internet de", _jsx("br", {}), "alta qualidade"] }), _jsx("p", { className: "text-brand-200/70 text-lg leading-relaxed", children: "Gerencie sua conta, faturas e conex\u00E3o em um s\u00F3 lugar." }), _jsx("div", { className: "mt-10 space-y-3 text-left", children: ['Pague faturas com Pix em segundos', 'Acompanhe o status da sua conexão', 'Histórico completo de pagamentos'].map((item) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-5 h-5 bg-brand-500/30 rounded-full flex items-center justify-center shrink-0", children: _jsx("div", { className: "w-2 h-2 bg-brand-400 rounded-full" }) }), _jsx("p", { className: "text-brand-100/80 text-sm", children: item })] }, item))) })] })] }), _jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: _jsxs("div", { className: "w-full max-w-sm animate-slide-up", children: [_jsxs("div", { className: "lg:hidden flex items-center gap-3 mb-8", children: [_jsx("div", { className: "w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center", children: _jsx(Zap, { size: 18, className: "text-white" }) }), _jsx("span", { className: "font-display font-700 text-white", children: "Meu Provedor" })] }), _jsx("h2", { className: "font-display text-2xl font-700 text-white mb-1", children: "Bem-vindo de volta" }), _jsx("p", { className: "text-slate-400 text-sm mb-8", children: "Entre com seu CPF e senha para continuar." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-1.5", children: "CPF" }), _jsx("input", { type: "text", inputMode: "numeric", placeholder: "000.000.000-00", value: cpf, onChange: (e) => setCpf(formatarCpf(e.target.value)), className: "input", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-1.5", children: "Senha" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: mostrarSenha ? 'text' : 'password', placeholder: "Sua senha", value: senha, onChange: (e) => setSenha(e.target.value), className: "input pr-11", required: true }), _jsx("button", { type: "button", onClick: () => setMostrarSenha(!mostrarSenha), className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors", children: mostrarSenha ? _jsx(EyeOff, { size: 17 }) : _jsx(Eye, { size: 17 }) })] })] }), erro && _jsx(Alert, { tipo: "erro", mensagem: erro }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn-primary w-full flex items-center justify-center gap-2", children: isLoading ? _jsx(Spinner, { size: "sm" }) : 'Entrar' })] }), _jsx("p", { className: "text-slate-500 text-xs text-center mt-8", children: "Problemas para entrar? Entre em contato com o suporte." })] }) })] }));
}
