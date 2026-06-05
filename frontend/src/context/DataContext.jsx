import { createContext, useContext, useState, useMemo } from 'react'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [casos, setCasos] = useState([])
  const [ventas, setVentas] = useState([])
  const [periodoDesde, setPeriodoDesde] = useState(null)
  const [periodoHasta, setPeriodoHasta] = useState(null)
  const [marcaActiva, setMarcaActiva] = useState('Todas')

  const marcas = useMemo(() => {
    const set = new Set(casos.map(c => c.marca).filter(Boolean))
    return ['Todas', ...Array.from(set).sort()]
  }, [casos])

  const casosFiltrados = useMemo(() => {
    return casos.filter(c => {
      const fecha = new Date(c.fecha_ingreso)
      if (periodoDesde && fecha < new Date(periodoDesde)) return false
      if (periodoHasta && fecha > new Date(periodoHasta + 'T23:59:59')) return false
      if (marcaActiva !== 'Todas' && c.marca !== marcaActiva) return false
      return true
    })
  }, [casos, periodoDesde, periodoHasta, marcaActiva])

  return (
    <DataContext.Provider value={{
      casos, setCasos,
      ventas, setVentas,
      periodoDesde, setPeriodoDesde,
      periodoHasta, setPeriodoHasta,
      marcaActiva, setMarcaActiva,
      marcas,
      casosFiltrados,
      casosCargados: casos.length > 0,
      ventasCargadas: ventas.length > 0,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
