import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { NavProvider, useNav } from './context/NavContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import CargasPage from './pages/CargasPage'

function Router() {
  const { page } = useNav()
  if (page === 'cargas') return <CargasPage />
  return <DashboardPage />
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DataProvider>
          <NavProvider>
            <Router />
          </NavProvider>
        </DataProvider>
      </ProtectedRoute>
    </AuthProvider>
  )
}
