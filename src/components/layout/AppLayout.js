import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
// Layout principal para as páginas autenticadas.
// A Sidebar fica fixa à esquerda; o conteúdo ocupa o resto.
export function AppLayout() {
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 ml-64 p-8 max-w-5xl", children: _jsx(Outlet, {}) })] }));
}
