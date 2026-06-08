import { createContext, useContext, useState } from 'react'

const NavContext = createContext(null)

export function NavProvider({ children }) {
  const [page, setPage] = useState('reclamos')
  const [collapsed, setCollapsed] = useState(false)
  return (
    <NavContext.Provider value={{ page, setPage, collapsed, setCollapsed }}>
      {children}
    </NavContext.Provider>
  )
}

export const useNav = () => useContext(NavContext)
