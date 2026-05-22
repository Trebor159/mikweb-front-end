import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Cores e rótulos para cada status
const CONFIG_FATURA = {
    pago: { cor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', label: 'Pago', dot: 'bg-emerald-400' },
    pendente: { cor: 'bg-amber-500/15  text-amber-400  border-amber-500/25', label: 'Pendente', dot: 'bg-amber-400' },
    vencido: { cor: 'bg-red-500/15    text-red-400    border-red-500/25', label: 'Vencido', dot: 'bg-red-400' },
};
const CONFIG_CONEXAO = {
    online: { cor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', label: 'Online', dot: 'bg-emerald-400 animate-pulse' },
    suspenso: { cor: 'bg-red-500/15    text-red-400    border-red-500/25', label: 'Suspenso', dot: 'bg-red-400' },
    offline: { cor: 'bg-slate-500/15  text-slate-400  border-slate-500/25', label: 'Offline', dot: 'bg-slate-400' },
};
export function StatusBadge({ status, tipo = 'fatura' }) {
    const config = tipo === 'conexao'
        ? CONFIG_CONEXAO[status] ?? CONFIG_CONEXAO.offline
        : CONFIG_FATURA[status] ?? CONFIG_FATURA.pendente;
    return (_jsxs("span", { className: `badge border ${config.cor}`, children: [_jsx("span", { className: `w-1.5 h-1.5 rounded-full ${config.dot}` }), config.label] }));
}
