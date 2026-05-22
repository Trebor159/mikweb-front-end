import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Spinner({ size = 'md' }) {
    const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size];
    return (_jsx("div", { className: `${s} border-2 border-brand-500 border-t-transparent rounded-full animate-spin` }));
}
export function PageLoader() {
    return (_jsxs("div", { className: "min-h-[400px] flex flex-col items-center justify-center gap-3", children: [_jsx(Spinner, { size: "lg" }), _jsx("p", { className: "text-slate-400 text-sm animate-pulse", children: "Carregando..." })] }));
}
