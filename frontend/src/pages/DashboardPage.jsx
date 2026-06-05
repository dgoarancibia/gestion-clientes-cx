import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: '#F8F7F4' }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-6"
        style={{
          height: 56,
          background: '#FFFFFF',
          borderBottom: '1px solid #E8E6E0',
          zIndex: 100,
        }}
      >
        <span className="font-medium" style={{ fontSize: 15, color: '#2C2C2A' }}>
          Dashboard CX
        </span>
        <div className="flex items-center gap-3">
          {user?.photo && (
            <img src={user.photo} alt="" className="rounded-full" style={{ width: 28, height: 28 }} />
          )}
          <span style={{ fontSize: 13, color: '#73726C' }}>{user?.name}</span>
          <button
            onClick={logout}
            className="rounded-lg px-3 py-1.5 transition-colors"
            style={{
              fontSize: 13,
              border: '0.5px solid #2C2C2A',
              background: 'transparent',
              cursor: 'pointer',
              color: '#2C2C2A',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#F3F2EE'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Content placeholder */}
      <main className="flex items-center justify-center" style={{ paddingTop: 56, minHeight: '100vh' }}>
        <div
          className="p-8 text-center"
          style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: '0.5px solid #E8E6E0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <p className="font-medium" style={{ fontSize: 16, color: '#2C2C2A', marginBottom: 4 }}>
            Bienvenida, {user?.name?.split(' ')[0]}
          </p>
          <p style={{ fontSize: 13, color: '#73726C' }}>
            Pronto podrás cargar tus datos y ver el dashboard.
          </p>
        </div>
      </main>
    </div>
  )
}
