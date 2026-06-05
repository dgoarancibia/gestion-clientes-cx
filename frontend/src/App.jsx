import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DataProvider>
          <DashboardPage />
        </DataProvider>
      </ProtectedRoute>
    </AuthProvider>
  )
}
