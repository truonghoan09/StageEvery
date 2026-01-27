import {
  createContext,
  useContext,
  useState,
} from 'react'

import { getAuthAdapter } from '../auth/getAuthAdapter'

export type AuthFlowState =
  | 'idle'
  | 'authenticating'
  | 'authenticated'

type AuthContextValue = {
  flow: AuthFlowState
  isAuthenticated: boolean
  sendMagicLink: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const authAdapter = getAuthAdapter()

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [flow, setFlow] = useState<AuthFlowState>('idle')

  const isAuthenticated = flow === 'authenticated'

  /* =========================
     SEND MAGIC LINK (DISABLED)
     — giữ để UI không vỡ
  ========================= */

  const sendMagicLink = async (email: string) => {
    console.warn(
      '[AUTH] Magic link disabled. OAuth only.',
      email
    )
  }

  /* =========================
     LOGOUT
  ========================= */

  const logout = async () => {
    await authAdapter.logout()
    setFlow('idle')
  }

  return (
    <AuthContext.Provider
      value={{
        flow,
        isAuthenticated,
        sendMagicLink,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
