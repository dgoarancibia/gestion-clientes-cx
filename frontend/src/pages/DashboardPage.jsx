import { useEffect } from 'react'
import { useData } from '../context/DataContext'
import { generarDatosDummy } from '../utils/dummyData'
import { calcularKPIs } from '../utils/kpis'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import FilterBar from '../components/FilterBar'
import DashboardMetricas from './DashboardMetricas'

function exportarCSV(casosFiltrados, kpis) {
  const rows = [
    ['KPI', 'Valor', 'Unidad'],
    ['Casos ingresados', kpis.total, 'casos'],
    ['Casos cerrados', kpis.cerrados, 'casos'],
    ['Backlog activo', kpis.abiertos, 'casos'],
    ['Tasa de reapertura', kpis.tasaReapertura, '%'],
    ['ART', kpis.art, 'días hábiles'],
    ['FRT', kpis.frt ?? '—', 'horas'],
    ['Tasa de escalamiento', kpis.tasaEscalamiento, '%'],
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const fecha = new Date().toISOString().split('T')[0]
  a.href = url; a.download = `resumen_cx_${fecha}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export default function DashboardPage() {
  const { casosCargados, setCasos, setCasosAnterior, setVentas, casosFiltrados } = useData()

  useEffect(() => {
    if (!casosCargados) {
      const { casos, casosAnterior, ventas } = generarDatosDummy()
      setCasos(casos)
      setCasosAnterior(casosAnterior)
      setVentas(ventas)
    }
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F3' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          title="Reclamos"
          subtitle="Análisis de casos del período seleccionado"
          onExport={casosCargados ? () => exportarCSV(casosFiltrados, calcularKPIs(casosFiltrados)) : null}
        />
        <FilterBar />
        <main style={{ paddingTop: casosCargados ? 104 : 56, overflowY: 'auto' }}>
          <DashboardMetricas />
        </main>
      </div>
    </div>
  )
}
