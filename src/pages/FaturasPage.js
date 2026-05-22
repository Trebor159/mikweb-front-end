import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { FileText, Copy, QrCode, ExternalLink, Check } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { faturaService } from '../services/api';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageLoader, Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
function formatarMoeda(v) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}
function formatarData(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
}
// ─── Modal de detalhes da fatura ──────────────────────────
function ModalFatura({ faturaId, onClose }) {
    const { data: fatura, isLoading, erro } = useApi(() => faturaService.detalhe(faturaId), [faturaId]);
    const [copiado, setCopiado] = useState(null);
    async function copiar(texto, tipo) {
        await navigator.clipboard.writeText(texto);
        setCopiado(tipo);
        setTimeout(() => setCopiado(null), 2000);
    }
    return (_jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsxs("div", { className: "card w-full max-w-md animate-slide-up", children: [_jsxs("div", { className: "flex items-center justify-between p-5 border-b border-slate-800/60", children: [_jsx("h3", { className: "font-display font-700 text-white", children: "Detalhes da Fatura" }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-white transition-colors text-xl leading-none", children: "\u2715" })] }), _jsxs("div", { className: "p-5 space-y-4", children: [isLoading && _jsx("div", { className: "flex justify-center py-6", children: _jsx(Spinner, { size: "lg" }) }), erro && _jsx(Alert, { tipo: "erro", mensagem: erro }), fatura && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Descri\u00E7\u00E3o" }), _jsx("span", { className: "text-slate-200 text-sm font-medium", children: fatura.descricao })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Valor" }), _jsx("span", { className: "text-white font-display font-700 text-lg", children: formatarMoeda(fatura.valor) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Vencimento" }), _jsx("span", { className: "text-slate-200 text-sm", children: formatarData(fatura.vencimento) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Status" }), _jsx(StatusBadge, { status: fatura.status })] })] }), fatura.pix && fatura.status !== 'pago' && (_jsxs("div", { className: "bg-slate-800/60 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(QrCode, { size: 16, className: "text-brand-400" }), _jsx("p", { className: "text-sm font-medium text-slate-200", children: "Pix Copia e Cola" })] }), _jsxs("p", { className: "text-xs text-slate-400 break-all font-mono bg-slate-900/60 p-2.5 rounded-lg mb-3 leading-relaxed", children: [fatura.pix.slice(0, 80), "..."] }), _jsx("button", { onClick: () => copiar(fatura.pix, 'pix'), className: "btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5", children: copiado === 'pix' ? (_jsxs(_Fragment, { children: [_jsx(Check, { size: 15 }), " Copiado!"] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { size: 15 }), " Copiar c\u00F3digo Pix"] })) })] })), fatura.codigoBarras && fatura.status !== 'pago' && (_jsxs("div", { className: "bg-slate-800/60 rounded-xl p-4", children: [_jsx("p", { className: "text-sm font-medium text-slate-200 mb-2", children: "C\u00F3digo de Barras" }), _jsx("p", { className: "text-xs text-slate-400 font-mono break-all bg-slate-900/60 p-2.5 rounded-lg mb-3", children: fatura.codigoBarras }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => copiar(fatura.codigoBarras, 'boleto'), className: "btn-secondary flex-1 flex items-center justify-center gap-2 text-sm py-2.5", children: copiado === 'boleto' ? _jsxs(_Fragment, { children: [_jsx(Check, { size: 15 }), " Copiado!"] }) : _jsxs(_Fragment, { children: [_jsx(Copy, { size: 15 }), " Copiar"] }) }), fatura.urlBoleto && (_jsxs("a", { href: fatura.urlBoleto, target: "_blank", rel: "noreferrer", className: "btn-secondary flex items-center justify-center gap-2 text-sm py-2.5 px-4", children: [_jsx(ExternalLink, { size: 15 }), " PDF"] }))] })] })), fatura.status === 'pago' && fatura.pagamento && (_jsx(Alert, { tipo: "sucesso", mensagem: `Pago em ${formatarData(fatura.pagamento)}${fatura.formaPagamento ? ` via ${fatura.formaPagamento}` : ''}` }))] }))] })] }) }));
}
// ─── Página principal ──────────────────────────────────────
export function FaturasPage() {
    const { data: faturas, isLoading, erro } = useApi(faturaService.listar);
    const [filtro, setFiltro] = useState('todas');
    const [faturaAberta, setFaturaAberta] = useState(null);
    const faturasFiltradas = faturas?.filter((f) => filtro === 'todas' ? true : f.status === filtro) ?? [];
    const FILTROS = [
        { key: 'todas', label: 'Todas' },
        { key: 'pendente', label: 'Pendentes' },
        { key: 'vencido', label: 'Vencidas' },
        { key: 'pago', label: 'Pagas' },
    ];
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-display text-3xl font-700 text-white", children: "Faturas" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Gerencie suas faturas e pagamentos" })] }), _jsx("div", { className: "flex gap-2 flex-wrap", children: FILTROS.map(({ key, label }) => (_jsx("button", { onClick: () => setFiltro(key), className: `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${filtro === key
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/40'}`, children: label }, key))) }), erro && _jsx(Alert, { tipo: "erro", mensagem: erro }), isLoading ? (_jsx(PageLoader, {})) : faturasFiltradas.length === 0 ? (_jsxs("div", { className: "card p-12 text-center", children: [_jsx(FileText, { size: 40, className: "text-slate-600 mx-auto mb-3" }), _jsx("p", { className: "text-slate-400", children: "Nenhuma fatura encontrada" })] })) : (_jsx("div", { className: "card divide-y divide-slate-800/60", children: faturasFiltradas.map((fatura) => (_jsxs("button", { onClick: () => setFaturaAberta(fatura.id), className: "w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors text-left", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0", children: _jsx(FileText, { size: 18, className: "text-slate-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-200 text-sm font-medium", children: fatura.descricao }), _jsxs("p", { className: "text-slate-500 text-xs mt-0.5", children: ["Vence em ", formatarData(fatura.vencimento), fatura.temPix && _jsx("span", { className: "ml-2 text-brand-400", children: "\u2022 Pix dispon\u00EDvel" })] })] })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0 ml-4", children: [_jsx(StatusBadge, { status: fatura.status }), _jsx("p", { className: "text-white font-display font-700", children: formatarMoeda(fatura.valor) })] })] }, fatura.id))) })), faturaAberta && (_jsx(ModalFatura, { faturaId: faturaAberta, onClose: () => setFaturaAberta(null) }))] }));
}
