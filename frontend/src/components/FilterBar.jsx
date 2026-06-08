import { useData } from '../context/DataContext'
import { SlidersHorizontal } from 'lucide-react'

function fmt(d) { return d.toISOString().split('T')[0] }

function rangoPreset(key) {
  const hoy = new Date()
  const y = hoy.getFullYear()
  const m = hoy.getMonth()

  switch (key) {
    case 'mes_actual':
      return [fmt(new Date(y, m, 1)), fmt(new Date(y, m + 1, 0))]
    case 'mes_anterior':
      return [fmt(new Date(y, m - 1, 1)), fmt(new Date(y, m, 0))]
    case 'trimestre_actual': {
      const qStart = Math.floor(m / 3) * 3
      return [fmt(new Date(y, qStart, 1)), fmt(new Date(y, qStart + 3, 0))]
    }
    case 'anio_actual':
      return [fmt(new Date(y, 0, 1)), fmt(new Date(y, 11, 31))]
    case 'anio_anterior':
      return [fmt(new Date(y - 1, 0, 1)), fmt(new Date(y - 1, 11, 31))]
    default:
      return [null, null]
  }
}

const PRESETS = [
  { key: '', label: 'Personalizado' },
  { key: 'mes_actual', label: 'Mes actual' },
  { key: 'mes_anterior', label: 'Mes anterior' },
  { key: 'trimestre_actual', label: 'Trimestre actual' },
  { key: 'anio_actual', label: 'Año actual' },
  { key: 'anio_anterior', label: 'Año anterior' },
]

export default function FilterBar() {
  const { casosCargados, periodoDesde, setPeriodoDesde, periodoHasta, setPeriodoHasta, marcas, marcaActiva, setMarcaActiva, tipos, tipoActivo, setTipoActivo } = useData()

  if (!casosCargados) return null

  const activeCount = [periodoDesde, periodoHasta, marcaActiva !== 'Todas', tipoActivo !== 'Todos'].filter(Boolean).length

  const handlePreset = (key) => {
    if (!key) return
    const [desde, hasta] = rangoPreset(key)
    setPeriodoDesde(desde)
    setPeriodoHasta(hasta)
  }

  return (
    <div style={{
      position: 'fixed', top: 56, left: 220, right: 0, zIndex: 90,
      background: '#FFFFFF', borderBottom: '1px solid #EBEBEB',
      padding: '0 24px', height: 48,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <SlidersHorizontal size={13} color="#9B9B96" />
        <span style={{ fontSize: 11, fontWeight: 600, color: '#9B9B96', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Filtrar por
        </span>
        {activeCount > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, background: '#1C1C1A', color: '#fff', borderRadius: 20, padding: '1px 6px' }}>
            {activeCount}
          </span>
        )}
      </div>

      <div style={{ width: 1, height: 20, background: '#EBEBEB' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <FilterChip label="Periodo">
          <select defaultValue="" onChange={e => handlePreset(e.target.value)}
            style={{ fontSize: 12, color: '#1C1C1A', border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }}>
            {PRESETS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
        </FilterChip>
        <FilterChip label="Desde">
          <input type="date" value={periodoDesde || ''} onChange={e => setPeriodoDesde(e.target.value || null)}
            style={{ fontSize: 12, color: '#1C1C1A', border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }} />
        </FilterChip>
        <FilterChip label="Hasta">
          <input type="date" value={periodoHasta || ''} onChange={e => setPeriodoHasta(e.target.value || null)}
            style={{ fontSize: 12, color: '#1C1C1A', border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }} />
        </FilterChip>
        <FilterChip label="Marca">
          <select value={marcaActiva} onChange={e => setMarcaActiva(e.target.value)}
            style={{ fontSize: 12, color: '#1C1C1A', border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }}>
            {marcas.map(m => <option key={m}>{m}</option>)}
          </select>
        </FilterChip>
        <FilterChip label="Tipo">
          <select value={tipoActivo} onChange={e => setTipoActivo(e.target.value)}
            style={{ fontSize: 12, color: '#1C1C1A', border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }}>
            {tipos.map(t => <option key={t}>{t}</option>)}
          </select>
        </FilterChip>
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => { setPeriodoDesde(null); setPeriodoHasta(null); setMarcaActiva('Todas'); setTipoActivo('Todos') }}
          style={{ fontSize: 11, color: '#9B9B96', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 4, textDecoration: 'underline' }}
        >
          Limpiar
        </button>
      )}
    </div>
  )
}

function FilterChip({ label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: '#F7F7F5', border: '1px solid #EBEBEB',
      borderRadius: 8, padding: '4px 10px',
    }}>
      <span style={{ fontSize: 11, color: '#9B9B96', whiteSpace: 'nowrap' }}>{label}</span>
      {children}
    </div>
  )
}
