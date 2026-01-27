import { AuthAdapter } from './AuthAdapter'
import { loginWithGoogle } from '../services/auth.service'

export class FirebaseAuthAdapter implements AuthAdapter {
  async login(idToken: string) {
    return loginWithGoogle(idToken)
  }

  async logout() {
    localStorage.removeItem('userId')
  }
}
