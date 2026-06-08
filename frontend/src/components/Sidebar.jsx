import { BarChart2, MessageSquare, PhoneIncoming, Users, Settings, ChevronRight, UploadCloud } from 'lucide-react'
import { useNav } from '../context/NavContext'

const NAV = [
  { id: 'reclamos', label: 'Reclamos', icon: BarChart2 },
  { id: 'cargas', label: 'Cargas', icon: UploadCloud },
  { id: 'inbound', label: 'Inbound', icon: PhoneIncoming, soon: true },
  { id: 'cx', label: 'CX', icon: MessageSquare, soon: true },
]

export default function Sidebar() {
  const { page, setPage } = useNav()
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: 220, background: '#1C1C1A',
      display: 'flex', flexDirection: 'column',
      zIndex: 200, borderRight: '1px solid #2E2E2B',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #2E2E2B' }}>
        <div className="flex items-center gap-2.5">
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #A8D5C2 0%, #B5D4F4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <BarChart2 size={16} color="#1C1C1A" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>Dashboard</p>
            <p style={{ fontSize: 11, color: '#6B6B67', lineHeight: 1.2 }}>CX Indumotora</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#4A4A46', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px 8px' }}>
          Módulos
        </p>
        {NAV.map(item => (
          <NavItem key={item.id} {...item} active={page === item.id} onClick={() => !item.soon && setPage(item.id)} />
        ))}

        <p style={{ fontSize: 10, fontWeight: 600, color: '#4A4A46', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 10px 8px' }}>
          Sistema
        </p>
        <NavItem id="config" label="Configuración" icon={Settings} />
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #2E2E2B' }}>
        <UserChip />
      </div>
    </aside>
  )
}

function NavItem({ id, label, icon: Icon, active, soon, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 8, marginBottom: 2, cursor: soon ? 'default' : 'pointer',
      background: active ? 'rgba(168,213,194,0.12)' : 'transparent',
      transition: 'background 0.15s',
    }}
    onMouseOver={e => { if (!active && !soon) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
    onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <Icon size={16} color={active ? '#A8D5C2' : soon ? '#3A3A36' : '#6B6B67'} strokeWidth={1.8} />
      <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? '#E8E8E4' : soon ? '#3A3A36' : '#9B9B96', flex: 1 }}>
        {label}
      </span>
      {soon && (
        <span style={{ fontSize: 10, background: '#2E2E2B', color: '#4A4A46', borderRadius: 4, padding: '1px 6px', fontWeight: 500 }}>
          Pronto
        </span>
      )}
      {active && <ChevronRight size={12} color="#A8D5C2" />}
    </div>
  )
}

function UserChip() {
  return (
    <div className="flex items-center gap-2.5" style={{ padding: '6px 10px' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'linear-gradient(135deg, #A8D5C2, #B5D4F4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, color: '#1C1C1A', flexShrink: 0,
      }}>CX</div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#C8C8C4', lineHeight: 1.2 }}>Marcela</p>
        <p style={{ fontSize: 10, color: '#4A4A46', lineHeight: 1.2 }}>Líder CX</p>
      </div>
    </div>
  )
}
