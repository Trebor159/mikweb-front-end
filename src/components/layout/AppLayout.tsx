import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

// Layout principal para as páginas autenticadas.
// A Sidebar fica fixa à esquerda; o conteúdo ocupa o resto.
export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-5xl">
        <Outlet />
      </main>
    </div>
  )
}
