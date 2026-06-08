import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { registrarCargaFirestore, obtenerHistorialFirestore } from '../utils/firestoreLog'

const DataContext = createContext(null)

const LS_CASOS = 'cx_casos'
const LS_CASOS_ANTERIOR = 'cx_casos_anterior'
const LS_VENTAS = 'cx_ventas'

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
  const { user } = useAuth()
  const [casos, setCasosState] = useState(() => leer(LS_CASOS, []))
  const [casosAnterior, setCasosAnteriorState] = useState(() => leer(LS_CASOS_ANTERIOR, []))
  const [ventas, setVentasState] = useState(() => leer(LS_VENTAS, []))
  const [logCargas, setLogCargas] = useState([])
  const [logCargando, setLogCargando] = useState(true)
  const [periodoDesde, setPeriodoDesde] = useState(null)
  const [periodoHasta, setPeriodoHasta] = useState(null)
  const [marcaActiva, setMarcaActiva] = useState('Todas')
  const [tipoActivo, setTipoActivo] = useState('Todos')

  // Persistir datos completos en localStorage (rápido, sin límite práctico de tamaño)
  useEffect(() => { guardar(LS_CASOS, casos) }, [casos])
  useEffect(() => { guardar(LS_CASOS_ANTERIOR, casosAnterior) }, [casosAnterior])
  useEffect(() => { guardar(LS_VENTAS, ventas) }, [ventas])

  // El historial de cargas vive en Firestore — compartido entre todo el equipo CX
  const refrescarLog = async () => {
    setLogCargando(true)
    const datos = await obtenerHistorialFirestore()
    setLogCargas(datos)
    setLogCargando(false)
  }

  useEffect(() => { refrescarLog() }, [])

  const registrar = async (tipo, cantidad, detalle) => {
    if (!user || tipo === 'dummy') return // no contaminar el log compartido con datos de ejemplo
    await registrarCargaFirestore({ uid: user.uid, email: user.email, tipo, cantidad, detalle })
    refrescarLog()
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

  // Para cargar dummy data sin ensuciar el historial compartido
  const setDatosDummy = ({ casos: c, casosAnterior: ca, ventas: v }) => {
    setCasosState(c)
    setCasosAnteriorState(ca)
    setVentasState(v)
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

  const ultimaCarga = logCargas.find(l => l.tipo === 'casos')

  return (
    <DataContext.Provider value={{
      casos, setCasos,
      casosAnterior, setCasosAnterior,
      ventas, setVentas,
      setDatosDummy,
      logCargas, logCargando, ultimaCarga,
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
