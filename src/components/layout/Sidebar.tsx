import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Wifi, User, LogOut, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const MENU = [
  { to: '/dashboard', label: 'Início',    Icon: LayoutDashboard },
  { to: '/faturas',   label: 'Faturas',   Icon: FileText         },
  { to: '/conexao',   label: 'Conexão',   Icon: Wifi             },
  { to: '/perfil',    label: 'Perfil',    Icon: User             },
]

export function Sidebar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col bg-slate-900/95 border-r border-slate-800/60 backdrop-blur-sm z-40">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/50">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-700 text-white text-sm leading-tight">Meu Provedor</p>
            <p className="text-slate-500 text-xs">Área do Cliente</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {MENU.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Usuário + Logout */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="px-3.5 py-2 mb-1">
          <p className="text-xs text-slate-500 truncate">Logado como</p>
          <p className="text-sm text-slate-200 font-medium truncate">{usuario?.nome}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
                     text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={17} />
          Sair
        </button>
      </div>
    </aside>
  )
}
