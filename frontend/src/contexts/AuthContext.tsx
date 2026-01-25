import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from 'firebase/auth'

import { notifyLoginSuccess } from '../services/auth.service'
import { auth } from '../firebase/firebaseClient'



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
  clickMagicLink: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)


export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [flow, setFlow] = useState<AuthFlowState>('idle')
  const [emailForSignIn, setEmailForSignIn] = useState<string | null>(null)

  const isAuthenticated = flow === 'authenticated'

  /* =========================
     SEND MAGIC LINK (REAL)
  ========================= */

  const sendMagicLink = async (email: string) => {
    try {
      setFlow('sending_email')

      await sendSignInLinkToEmail(auth, email, {
        url: window.location.origin + '/auth/login',
        handleCodeInApp: true,
      })

      window.localStorage.setItem(
        'emailForSignIn',
        email
      )

      setEmailForSignIn(email)
      setFlow('email_sent')
    } catch (err) {
      console.error('[AUTH] send magic link failed', err)
      setFlow('email_failed')
    }
  }

  /* =========================
     CLICK MAGIC LINK (REAL)
  ========================= */

  const clickMagicLink = async () => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        return
      }

      const storedEmail =
        emailForSignIn ||
        window.localStorage.getItem('emailForSignIn')

      if (!storedEmail) {
        throw new Error('Missing email for sign-in')
      }

      const result = await signInWithEmailLink(
        auth,
        storedEmail,
        window.location.href
      )

      window.localStorage.removeItem('emailForSignIn')

      const user = result.user
      const idToken = await user.getIdToken()

      // 🔔 RESET RATE LIMIT ON BACKEND
      await notifyLoginSuccess(idToken)
      setFlow('authenticated')
    } catch (err) {
      console.error('[AUTH] sign-in failed', err)
      setFlow('email_failed')
    }
  }

  /* =========================
     AUTO-DETECT MAGIC LINK
  ========================= */

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      clickMagicLink()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* =========================
     LOGOUT
  ========================= */

  const logout = async () => {
    await signOut(auth)
    setFlow('idle')
  }

  return (
    <AuthContext.Provider
      value={{
        flow,
        isAuthenticated,
        sendMagicLink,
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
