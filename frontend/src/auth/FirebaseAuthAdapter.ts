import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase/firebaseClient'
import { AuthAdapter } from './AuthAdapter'
import { notifyLoginSuccess } from '../services/auth.service'

export class FirebaseAuthAdapter implements AuthAdapter {
  async sendMagicLink(email: string) {
    await sendSignInLinkToEmail(auth, email, {
      url: window.location.origin + '/auth/login',
      handleCodeInApp: true,
    })

    localStorage.setItem('emailForSignIn', email)
  }

  async clickMagicLink() {
    if (!isSignInWithEmailLink(auth, window.location.href)) return

    const email = localStorage.getItem('emailForSignIn')
    if (!email) throw new Error('Missing email')

    const result = await signInWithEmailLink(
      auth,
      email,
      window.location.href
    )

    localStorage.removeItem('emailForSignIn')

    const token = await result.user.getIdToken()
    await notifyLoginSuccess(token)

    window.history.replaceState({}, document.title, '/auth/login')
  }

  async logout() {
    await signOut(auth)
  }
}
