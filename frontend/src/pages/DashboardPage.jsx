import { useEffect } from 'react'
import { useData } from '../context/DataContext'
import { generarDatosDummy } from '../utils/dummyData'
import Header from '../components/Header'
import BienvenidaPage from './BienvenidaPage'
import DashboardMetricas from './DashboardMetricas'

export default function DashboardPage() {
  const { casosCargados, setCasos, setVentas } = useData()

  useEffect(() => {
    if (!casosCargados) {
      const { casos, ventas } = generarDatosDummy()
      setCasos(casos)
      setVentas(ventas)
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#F8F7F4' }}>
      <Header />
      <main style={{ paddingTop: 56 }}>
        <DashboardMetricas />
      </main>
    </div>
  )
}
