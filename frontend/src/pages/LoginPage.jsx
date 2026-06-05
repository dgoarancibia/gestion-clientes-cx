import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, authError } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F7F4' }}>
      <div
        className="flex flex-col items-center gap-6 p-10"
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          border: '0.5px solid #E8E6E0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          minWidth: 360,
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-medium" style={{ fontSize: 20, color: '#2C2C2A' }}>
            Dashboard CX
          </h1>
          <p style={{ fontSize: 13, color: '#73726C' }}>Indumotora — Área Customer Experience</p>
        </div>

        {authError && (
          <div
            className="w-full text-center rounded-lg px-4 py-2"
            style={{ background: '#F8D7DA', color: '#721C24', fontSize: 13, borderRadius: 8 }}
          >
            {authError}
          </div>
        )}

        <button
          onClick={login}
          className="flex items-center gap-3 w-full justify-center rounded-lg px-4 py-2.5 transition-colors cursor-pointer"
          style={{ background: '#2C2C2A', color: '#fff', fontSize: 14, fontWeight: 500, border: 'none' }}
          onMouseOver={e => e.currentTarget.style.background = '#444441'}
          onMouseOut={e => e.currentTarget.style.background = '#2C2C2A'}
        >
          <GoogleIcon />
          Ingresar con Google
        </button>

        <p style={{ fontSize: 12, color: '#73726C', textAlign: 'center' }}>
          Acceso restringido — solo usuarios autorizados
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
