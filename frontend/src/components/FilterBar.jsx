import { useData } from '../context/DataContext'
import { SlidersHorizontal } from 'lucide-react'

export default function FilterBar() {
  const { casosCargados, periodoDesde, setPeriodoDesde, periodoHasta, setPeriodoHasta, marcas, marcaActiva, setMarcaActiva } = useData()

  if (!casosCargados) return null

  const activeCount = [periodoDesde, periodoHasta, marcaActiva !== 'Todas'].filter(Boolean).length

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
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => { setPeriodoDesde(null); setPeriodoHasta(null); setMarcaActiva('Todas') }}
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
