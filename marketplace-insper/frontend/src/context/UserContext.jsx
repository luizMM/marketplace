import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gamevault_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('gamevault_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('gamevault_user')
  }

  const updateBalance = (newBalance) => {
    const updated = { ...user, balance: newBalance }
    setUser(updated)
    localStorage.setItem('gamevault_user', JSON.stringify(updated))
  }

  return (
    <UserContext.Provider value={{ user, login, logout, updateBalance }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
