import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { User, Lock, Phone, Mail, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { clienteService } from '../services/api';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
export function PerfilPage() {
    const { usuario, logout } = useAuth();
    const { data: suporte } = useApi(clienteService.suporte);
    // Estado do formulário de troca de senha
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenhas, setMostrarSenhas] = useState(false);
    const [loadingSenha, setLoadingSenha] = useState(false);
    const [alertaSenha, setAlertaSenha] = useState(null);
    async function handleTrocarSenha(e) {
        e.preventDefault();
        setAlertaSenha(null);
        if (novaSenha !== confirmarSenha) {
            setAlertaSenha({ tipo: 'erro', msg: 'As senhas não coincidem.' });
            return;
        }
        if (novaSenha.length < 6) {
            setAlertaSenha({ tipo: 'erro', msg: 'A nova senha deve ter no mínimo 6 caracteres.' });
            return;
        }
        setLoadingSenha(true);
        try {
            await clienteService.trocarSenha(senhaAtual, novaSenha);
            setAlertaSenha({ tipo: 'sucesso', msg: 'Senha alterada com sucesso!' });
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
        }
        catch {
            setAlertaSenha({ tipo: 'erro', msg: 'Senha atual incorreta ou erro ao salvar.' });
        }
        finally {
            setLoadingSenha(false);
        }
    }
    function formatarCpf(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-3xl font-700 text-white", children: "Perfil" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Seus dados e configura\u00E7\u00F5es de conta" })] }), _jsxs("div", { className: "card p-6 animate-slide-up", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-14 h-14 bg-brand-600/20 rounded-2xl flex items-center justify-center", children: _jsx(User, { size: 24, className: "text-brand-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-display font-700 text-white text-lg", children: usuario?.nome }), _jsx("p", { className: "text-slate-400 text-sm", children: "Cliente ativo" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl", children: [_jsx(User, { size: 15, className: "text-slate-500 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "CPF" }), _jsx("p", { className: "text-slate-200 text-sm font-mono", children: formatarCpf(usuario?.cpf ?? '') })] })] }), usuario?.email && (_jsxs("div", { className: "flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl", children: [_jsx(Mail, { size: 15, className: "text-slate-500 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "E-mail" }), _jsx("p", { className: "text-slate-200 text-sm", children: usuario.email })] })] })), usuario?.celular && (_jsxs("div", { className: "flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl", children: [_jsx(Phone, { size: 15, className: "text-slate-500 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "Celular" }), _jsx("p", { className: "text-slate-200 text-sm", children: usuario.celular })] })] }))] })] }), _jsxs("div", { className: "card p-6 animate-slide-up delay-100", children: [_jsxs("div", { className: "flex items-center gap-3 mb-5", children: [_jsx(Lock, { size: 18, className: "text-brand-400" }), _jsx("h3", { className: "font-display font-700 text-white", children: "Alterar Senha" })] }), _jsxs("form", { onSubmit: handleTrocarSenha, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-1.5", children: "Senha atual" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: mostrarSenhas ? 'text' : 'password', value: senhaAtual, onChange: (e) => setSenhaAtual(e.target.value), className: "input pr-11", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022", required: true }), _jsx("button", { type: "button", onClick: () => setMostrarSenhas(!mostrarSenhas), className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors", children: mostrarSenhas ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-1.5", children: "Nova senha" }), _jsx("input", { type: mostrarSenhas ? 'text' : 'password', value: novaSenha, onChange: (e) => setNovaSenha(e.target.value), className: "input", placeholder: "M\u00EDnimo 6 caracteres", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-1.5", children: "Confirmar nova senha" }), _jsx("input", { type: mostrarSenhas ? 'text' : 'password', value: confirmarSenha, onChange: (e) => setConfirmarSenha(e.target.value), className: "input", placeholder: "Repita a nova senha", required: true })] }), alertaSenha && _jsx(Alert, { tipo: alertaSenha.tipo, mensagem: alertaSenha.msg }), _jsx("button", { type: "submit", disabled: loadingSenha, className: "btn-primary flex items-center justify-center gap-2", children: loadingSenha ? _jsx(Spinner, { size: "sm" }) : 'Salvar nova senha' })] })] }), suporte && (_jsxs("div", { className: "card p-5 animate-slide-up delay-200", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx(MessageCircle, { size: 18, className: "text-emerald-400" }), _jsx("h3", { className: "font-display font-700 text-white", children: "Suporte" })] }), _jsx("p", { className: "text-slate-400 text-sm mb-4", children: "Precisa de ajuda? Fale com nossa equipe pelo WhatsApp." }), _jsxs("a", { href: suporte.link, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors", children: [_jsx(MessageCircle, { size: 16 }), "Abrir WhatsApp"] })] })), _jsxs("div", { className: "card p-5 animate-slide-up delay-300", children: [_jsx("p", { className: "text-slate-400 text-sm mb-4", children: "Quer sair da sua conta?" }), _jsx("button", { onClick: logout, className: "px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors border border-red-500/25", children: "Sair da conta" })] })] }));
}
