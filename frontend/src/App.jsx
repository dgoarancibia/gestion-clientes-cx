import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    </AuthProvider>
  )
}
