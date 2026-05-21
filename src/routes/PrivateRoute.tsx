import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Envolve rotas que precisam de login.
// Se não estiver autenticado, redireciona para /login.
export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()

  // Ainda verificando se tem token no localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}
