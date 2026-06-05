import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { LogOut } from 'lucide-react'

export default function TopBar({ title, subtitle }) {
  const { user, logout } = useAuth()
  const { casosCargados, periodoDesde, setPeriodoDesde, periodoHasta, setPeriodoHasta, marcas, marcaActiva, setMarcaActiva } = useData()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 220, right: 0,
      height: 56, background: '#FFFFFF',
      borderBottom: '1px solid #EBEBEB',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', zIndex: 100,
    }}>
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 600, color: '#1C1C1A', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: '#9B9B96', lineHeight: 1.2 }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {casosCargados && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label style={{ fontSize: 11, color: '#9B9B96', whiteSpace: 'nowrap' }}>Desde</label>
              <input type="date" value={periodoDesde || ''} onChange={e => setPeriodoDesde(e.target.value || null)}
                style={{ fontSize: 12, color: '#1C1C1A', border: '1px solid #EBEBEB', borderRadius: 6, padding: '4px 8px', background: '#FAFAFA', outline: 'none' }} />
            </div>
            <div className="flex items-center gap-1.5">
              <label style={{ fontSize: 11, color: '#9B9B96', whiteSpace: 'nowrap' }}>Hasta</label>
              <input type="date" value={periodoHasta || ''} onChange={e => setPeriodoHasta(e.target.value || null)}
                style={{ fontSize: 12, color: '#1C1C1A', border: '1px solid #EBEBEB', borderRadius: 6, padding: '4px 8px', background: '#FAFAFA', outline: 'none' }} />
            </div>
            <div className="flex items-center gap-1.5">
              <label style={{ fontSize: 11, color: '#9B9B96', whiteSpace: 'nowrap' }}>Marca</label>
              <select value={marcaActiva} onChange={e => setMarcaActiva(e.target.value)}
                style={{ fontSize: 12, color: '#1C1C1A', border: '1px solid #EBEBEB', borderRadius: 6, padding: '4px 8px', background: '#FAFAFA', outline: 'none', cursor: 'pointer' }}>
                {marcas.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        )}

        <div style={{ width: 1, height: 20, background: '#EBEBEB' }} />

        <div className="flex items-center gap-2.5">
          {user?.photo
            ? <img src={user.photo} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
            : <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F0F0EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#6B6B67' }}>
                {user?.name?.[0]}
              </div>
          }
          <span style={{ fontSize: 13, color: '#4A4A46' }}>{user?.name?.split(' ')[0]}</span>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9B9B96', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6 }}
            onMouseOver={e => { e.currentTarget.style.background = '#F5F5F3'; e.currentTarget.style.color = '#1C1C1A' }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9B9B96' }}>
            <LogOut size={13} />
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
