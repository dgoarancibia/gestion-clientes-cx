import { createContext, useContext, useState } from 'react'

const NavContext = createContext(null)

export function NavProvider({ children }) {
  const [page, setPage] = useState('reclamos')
  return (
    <NavContext.Provider value={{ page, setPage }}>
      {children}
    </NavContext.Provider>
  )
}

export const useNav = () => useContext(NavContext)
