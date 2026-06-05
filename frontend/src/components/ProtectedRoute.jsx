import { useAuth } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F7F4' }}>
        <div className="text-sm" style={{ color: '#73726C' }}>Cargando...</div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return children
}
