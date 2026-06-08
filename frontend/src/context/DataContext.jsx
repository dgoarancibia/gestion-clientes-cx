import { createContext, useContext, useState, useMemo, useEffect } from 'react'

const DataContext = createContext(null)

const LS_CASOS = 'cx_casos'
const LS_CASOS_ANTERIOR = 'cx_casos_anterior'
const LS_VENTAS = 'cx_ventas'
const LS_LOG = 'cx_log_cargas'

function leer(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function guardar(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage lleno o no disponible — ignorar silenciosamente
  }
}

export function DataProvider({ children }) {
  const [casos, setCasosState] = useState(() => leer(LS_CASOS, []))
  const [casosAnterior, setCasosAnteriorState] = useState(() => leer(LS_CASOS_ANTERIOR, []))
  const [ventas, setVentasState] = useState(() => leer(LS_VENTAS, []))
  const [logCargas, setLogCargas] = useState(() => leer(LS_LOG, []))
  const [periodoDesde, setPeriodoDesde] = useState(null)
  const [periodoHasta, setPeriodoHasta] = useState(null)
  const [marcaActiva, setMarcaActiva] = useState('Todas')
  const [tipoActivo, setTipoActivo] = useState('Todos')

  // Persistir en localStorage cada vez que cambian
  useEffect(() => { guardar(LS_CASOS, casos) }, [casos])
  useEffect(() => { guardar(LS_CASOS_ANTERIOR, casosAnterior) }, [casosAnterior])
  useEffect(() => { guardar(LS_VENTAS, ventas) }, [ventas])
  useEffect(() => { guardar(LS_LOG, logCargas) }, [logCargas])

  // Wrappers que registran un evento en el log de cargas
  const registrar = (tipo, cantidad, detalle) => {
    setLogCargas(prev => [
      { fecha: new Date().toISOString(), tipo, cantidad, detalle },
      ...prev,
    ].slice(0, 50)) // conserva últimos 50 eventos
  }

  const setCasos = (data, detalle) => {
    setCasosState(data)
    registrar('casos', data.length, detalle)
  }
  const setCasosAnterior = (data, detalle) => {
    setCasosAnteriorState(data)
    registrar('casos_anterior', data.length, detalle)
  }
  const setVentas = (data, detalle) => {
    setVentasState(data)
    registrar('ventas', data.length, detalle)
  }

  const limpiarDatos = () => {
    setCasosState([]); setCasosAnteriorState([]); setVentasState([])
    localStorage.removeItem(LS_CASOS)
    localStorage.removeItem(LS_CASOS_ANTERIOR)
    localStorage.removeItem(LS_VENTAS)
  }

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
      logCargas,
      limpiarDatos,
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
