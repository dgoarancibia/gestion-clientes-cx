import { BarChart2, MessageSquare, PhoneIncoming, Settings, ChevronRight, ChevronLeft, UploadCloud } from 'lucide-react'
import { useNav } from '../context/NavContext'

const NAV = [
  { id: 'reclamos', label: 'Reclamos', icon: BarChart2 },
  { id: 'cargas', label: 'Cargas', icon: UploadCloud },
  { id: 'inbound', label: 'Inbound', icon: PhoneIncoming, soon: true },
  { id: 'cx', label: 'CX', icon: MessageSquare, soon: true },
]

export const SIDEBAR_WIDTH = 220
export const SIDEBAR_WIDTH_COLLAPSED = 64

export default function Sidebar() {
  const { page, setPage, collapsed, setCollapsed } = useNav()
  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width, background: '#1C1C1A',
      display: 'flex', flexDirection: 'column',
      zIndex: 200, borderRight: '1px solid #2E2E2B',
      transition: 'width 0.15s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 16px 16px' : '20px 20px 16px', borderBottom: '1px solid #2E2E2B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2.5">
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #A8D5C2 0%, #B5D4F4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <BarChart2 size={16} color="#1C1C1A" />
          </div>
          {!collapsed && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2, whiteSpace: 'nowrap' }}>Dashboard</p>
              <p style={{ fontSize: 11, color: '#6B6B67', lineHeight: 1.2, whiteSpace: 'nowrap' }}>CX Indumotora</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {!collapsed && (
          <p style={{ fontSize: 10, fontWeight: 600, color: '#4A4A46', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px 8px', whiteSpace: 'nowrap' }}>
            Módulos
          </p>
        )}
        {NAV.map(item => (
          <NavItem key={item.id} {...item} collapsed={collapsed} active={page === item.id} onClick={() => !item.soon && setPage(item.id)} />
        ))}

        {!collapsed && (
          <p style={{ fontSize: 10, fontWeight: 600, color: '#4A4A46', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 10px 8px', whiteSpace: 'nowrap' }}>
            Sistema
          </p>
        )}
        <NavItem id="config" label="Configuración" icon={Settings} collapsed={collapsed} />
      </nav>

      {/* Toggle */}
      <div style={{ padding: '8px 10px', borderTop: '1px solid #2E2E2B' }}>
        <button onClick={() => setCollapsed(c => !c)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8, width: '100%', padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B67' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span style={{ fontSize: 12, whiteSpace: 'nowrap' }}>Colapsar menú</span>}
        </button>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #2E2E2B' }}>
        <UserChip collapsed={collapsed} />
      </div>
    </aside>
  )
}

function NavItem({ label, icon: Icon, active, soon, onClick, collapsed }) {
  return (
    <div onClick={onClick} title={collapsed ? label : undefined} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: collapsed ? '8px' : '8px 10px', justifyContent: collapsed ? 'center' : 'flex-start',
      borderRadius: 8, marginBottom: 2, cursor: soon ? 'default' : 'pointer',
      background: active ? 'rgba(168,213,194,0.12)' : 'transparent',
      transition: 'background 0.15s',
    }}
    onMouseOver={e => { if (!active && !soon) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
    onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <Icon size={16} color={active ? '#A8D5C2' : soon ? '#3A3A36' : '#6B6B67'} strokeWidth={1.8} />
      {!collapsed && (
        <>
          <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? '#E8E8E4' : soon ? '#3A3A36' : '#9B9B96', flex: 1, whiteSpace: 'nowrap' }}>
            {label}
          </span>
          {soon && (
            <span style={{ fontSize: 10, background: '#2E2E2B', color: '#4A4A46', borderRadius: 4, padding: '1px 6px', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Pronto
            </span>
          )}
          {active && <ChevronRight size={12} color="#A8D5C2" />}
        </>
      )}
    </div>
  )
}

function UserChip({ collapsed }) {
  return (
    <div className="flex items-center gap-2.5" style={{ padding: '6px 10px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'linear-gradient(135deg, #A8D5C2, #B5D4F4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, color: '#1C1C1A', flexShrink: 0,
      }}>CX</div>
      {!collapsed && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#C8C8C4', lineHeight: 1.2, whiteSpace: 'nowrap' }}>Marcela</p>
          <p style={{ fontSize: 10, color: '#4A4A46', lineHeight: 1.2, whiteSpace: 'nowrap' }}>Líder CX</p>
        </div>
      )}
    </div>
  )
}
