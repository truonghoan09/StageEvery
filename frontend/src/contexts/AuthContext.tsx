import { createContext, useContext, useState } from 'react'
import { FirebaseAuthAdapter } from '../auth/FirebaseAuthAdapter'

type AuthContextType = {
  isAuthenticated: boolean
  login: (idToken: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authAdapter = new FirebaseAuthAdapter()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('userId'))
  })

  async function login(idToken: string) {
    await authAdapter.login(idToken)
    setIsAuthenticated(true)
  }

  function logout() {
    authAdapter.logout()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
