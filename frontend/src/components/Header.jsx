import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { casosCargados, periodoDesde, setPeriodoDesde, periodoHasta, setPeriodoHasta, marcas, marcaActiva, setMarcaActiva } = useData()

  return (
    <header
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 gap-4"
      style={{ height: 56, background: '#FFFFFF', borderBottom: '1px solid #E8E6E0', zIndex: 100 }}
    >
      <span style={{ fontSize: 15, fontWeight: 500, color: '#2C2C2A', whiteSpace: 'nowrap' }}>
        Dashboard CX
      </span>

      {casosCargados && (
        <>
          <div style={{ width: 1, height: 20, background: '#E8E6E0', flexShrink: 0 }} />
          <div className="flex items-center gap-3 flex-1">
            <span style={{ fontSize: 11, color: '#73726C', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filtros</span>
            <div className="flex items-center gap-1.5">
              <label style={{ fontSize: 12, color: '#73726C', whiteSpace: 'nowrap' }}>Desde</label>
              <input
                type="date"
                value={periodoDesde || ''}
                onChange={e => setPeriodoDesde(e.target.value || null)}
                style={{
                  fontSize: 12, color: '#2C2C2A', border: '0.5px solid #E8E6E0',
                  borderRadius: 6, padding: '3px 8px', background: '#FAFAF9', outline: 'none'
                }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label style={{ fontSize: 12, color: '#73726C', whiteSpace: 'nowrap' }}>Hasta</label>
              <input
                type="date"
                value={periodoHasta || ''}
                onChange={e => setPeriodoHasta(e.target.value || null)}
                style={{
                  fontSize: 12, color: '#2C2C2A', border: '0.5px solid #E8E6E0',
                  borderRadius: 6, padding: '3px 8px', background: '#FAFAF9', outline: 'none'
                }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label style={{ fontSize: 12, color: '#73726C', whiteSpace: 'nowrap' }}>Marca</label>
              <select
                value={marcaActiva}
                onChange={e => setMarcaActiva(e.target.value)}
                style={{
                  fontSize: 12, color: '#2C2C2A', border: '0.5px solid #E8E6E0',
                  borderRadius: 6, padding: '3px 8px', background: '#FAFAF9', outline: 'none', cursor: 'pointer'
                }}
              >
                {marcas.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        {user?.photo && (
          <img src={user.photo} alt="" className="rounded-full" style={{ width: 28, height: 28 }} />
        )}
        <span style={{ fontSize: 13, color: '#73726C' }}>{user?.name?.split(' ')[0]}</span>
        <button
          onClick={logout}
          className="rounded-lg px-3 py-1.5 cursor-pointer transition-colors"
          style={{ fontSize: 13, border: '0.5px solid #2C2C2A', background: 'transparent', color: '#2C2C2A' }}
          onMouseOver={e => e.currentTarget.style.background = '#F3F2EE'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
