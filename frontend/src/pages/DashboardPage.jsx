import { useData } from '../context/DataContext'
import Header from '../components/Header'
import BienvenidaPage from './BienvenidaPage'

export default function DashboardPage() {
  const { casosCargados } = useData()

  return (
    <div className="min-h-screen" style={{ background: '#F8F7F4' }}>
      <Header />
      <main style={{ paddingTop: 56 }}>
        {!casosCargados ? (
          <BienvenidaPage />
        ) : (
          <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div
              style={{
                background: '#FFFFFF', borderRadius: 12,
                border: '0.5px solid #E8E6E0', padding: '32px 40px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center'
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 500, color: '#2C2C2A', marginBottom: 4 }}>
                Datos cargados correctamente
              </p>
              <p style={{ fontSize: 13, color: '#73726C' }}>
                El dashboard de métricas estará disponible en el siguiente paso.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
