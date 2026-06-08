import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, ALLOWED_EMAILS } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && ALLOWED_EMAILS.includes(firebaseUser.email)) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
        })
        setAuthError(null)
      } else if (firebaseUser) {
        signOut(auth)
        setAuthError('Acceso no autorizado. Este dashboard es de uso privado.')
        setUser(null)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    setAuthError(null)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      console.error('Firebase auth error:', e.code, e.message)
      if (e.code !== 'auth/popup-closed-by-user') {
        setAuthError(`Error al iniciar sesión (${e.code || 'desconocido'}). Intenta nuevamente.`)
      }
    }
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
