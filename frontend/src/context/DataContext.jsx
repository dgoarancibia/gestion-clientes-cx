import { createContext, useContext, useState, useMemo } from 'react'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [casos, setCasos] = useState([])
  const [casosAnterior, setCasosAnterior] = useState([])
  const [ventas, setVentas] = useState([])
  const [periodoDesde, setPeriodoDesde] = useState(null)
  const [periodoHasta, setPeriodoHasta] = useState(null)
  const [marcaActiva, setMarcaActiva] = useState('Todas')
  const [tipoActivo, setTipoActivo] = useState('Todos')

  const marcas = useMemo(() => {
    const set = new Set(casos.map(c => c.marca).filter(Boolean))
    return ['Todas', ...Array.from(set).sort()]
  }, [casos])

  const tipos = useMemo(() => {
    const set = new Set(casos.map(c => c.tipo_caso).filter(Boolean))
    return ['Todos', ...Array.from(set).sort()]
  }, [casos])

  const casosFiltrados = useMemo(() => {
    return casos.filter(c => {
      const fecha = new Date(c.fecha_ingreso)
      if (periodoDesde && fecha < new Date(periodoDesde)) return false
      if (periodoHasta && fecha > new Date(periodoHasta + 'T23:59:59')) return false
      if (marcaActiva !== 'Todas' && c.marca !== marcaActiva) return false
      if (tipoActivo !== 'Todos' && c.tipo_caso !== tipoActivo) return false
      return true
    })
  }, [casos, periodoDesde, periodoHasta, marcaActiva, tipoActivo])

  const casosAnteriorFiltrados = useMemo(() => {
    return casosAnterior.filter(c =>
      (marcaActiva === 'Todas' || c.marca === marcaActiva) &&
      (tipoActivo === 'Todos' || c.tipo_caso === tipoActivo)
    )
  }, [casosAnterior, marcaActiva, tipoActivo])

  return (
    <DataContext.Provider value={{
      casos, setCasos,
      casosAnterior, setCasosAnterior,
      ventas, setVentas,
      periodoDesde, setPeriodoDesde,
      periodoHasta, setPeriodoHasta,
      marcaActiva, setMarcaActiva,
      marcas,
      tipoActivo, setTipoActivo,
      tipos,
      casosFiltrados,
      casosAnteriorFiltrados,
      casosCargados: casos.length > 0,
      ventasCargadas: ventas.length > 0,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
