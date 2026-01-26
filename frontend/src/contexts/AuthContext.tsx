import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { getAuthAdapter } from '../auth/getAuthAdapter'

export type AuthFlowState =
  | 'idle'
  | 'sending_email'
  | 'email_sent'
  | 'email_failed'
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
     SEND MAGIC LINK
  ========================= */

  const sendMagicLink = async (email: string) => {
    try {
      setFlow('sending_email')
      await authAdapter.sendMagicLink(email)
      setFlow('email_sent')
    } catch (err) {
      console.error('[AUTH] sendMagicLink failed', err)
      setFlow('email_failed')
    }
  }

  /* =========================
     AUTO-DETECT MAGIC LINK
  ========================= */

  // useEffect(() => {
  //   authAdapter
  //     .clickMagicLink()
  //     .then(() => {
  //       setFlow('authenticated')
  //     })
  //     .catch(() => {
  //       // ignore
  //     })
  // }, [])

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
