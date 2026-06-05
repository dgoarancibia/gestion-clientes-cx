import { useEffect } from 'react'
import { useData } from '../context/DataContext'
import { generarDatosDummy } from '../utils/dummyData'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F3' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar title="Reclamos" subtitle="Análisis de casos del período seleccionado" />
        <main style={{ paddingTop: 56, overflowY: 'auto' }}>
          <DashboardMetricas />
        </main>
      </div>
    </div>
  )
}
