import {
  createContext,
  useContext,
  useState,
} from 'react'

export type AuthFlowState =
  | 'idle'
  | 'sending_email'
  | 'email_sent'
  | 'email_failed'
  | 'cooldown'
  | 'link_clicked'
  | 'authenticated'

type AuthContextValue = {
  flow: AuthFlowState
  isAuthenticated: boolean
  sendMagicLink: (email: string) => void
  failSendMagicLink: () => void
  clickMagicLink: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [flow, setFlow] = useState<AuthFlowState>('idle')

  const isAuthenticated = flow === 'authenticated'

  /* =========================
     FAKE ACTIONS
  ========================= */

  const sendMagicLink = (email: string) => {
    console.log('[FAKE AUTH] sending email to:', email)

    setFlow('sending_email')

    // Fake async
    setTimeout(() => {
      setFlow('email_sent')
    }, 800)
  }

  const failSendMagicLink = () => {
    console.log('[FAKE AUTH] send email failed')
    setFlow('email_failed')
  }

  const clickMagicLink = () => {
    console.log('[FAKE AUTH] magic link clicked')
    setFlow('authenticated')
  }

  const logout = () => {
    setFlow('idle')
  }

  return (
    <AuthContext.Provider
      value={{
        flow,
        isAuthenticated,
        sendMagicLink,
        failSendMagicLink,
        clickMagicLink,
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
