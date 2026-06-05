import { useAuth } from '../context/AuthContext'
import { Download, LogOut } from 'lucide-react'

export default function TopBar({ title, subtitle, onExport }) {
  const { user, logout } = useAuth()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 220, right: 0,
      height: 56, background: '#1C1C1A',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', zIndex: 100,
      borderBottom: '1px solid #2E2E2B',
    }}>
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: '#6B6B67', lineHeight: 1.2 }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onExport && (
          <button onClick={onExport}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 500, color: '#E8E8E4',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <Download size={13} />
            Exportar CSV
          </button>
        )}

        <div style={{ width: 1, height: 20, background: '#2E2E2B' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user?.photo
            ? <img src={user.photo} alt="" style={{ width: 26, height: 26, borderRadius: '50%', border: '1.5px solid #3A3A36' }} />
            : <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#3A3A36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#A8D5C2' }}>
                {user?.name?.[0]}
              </div>
          }
          <span style={{ fontSize: 12, color: '#9B9B96' }}>{user?.name?.split(' ')[0]}</span>
          <button onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B6B67', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6 }}
            onMouseOver={e => { e.currentTarget.style.color = '#E8E8E4'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            onMouseOut={e => { e.currentTarget.style.color = '#6B6B67'; e.currentTarget.style.background = 'none' }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}
