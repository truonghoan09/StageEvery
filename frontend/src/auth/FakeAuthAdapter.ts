import { AuthAdapter } from './AuthAdapter'

export class FakeAuthAdapter implements AuthAdapter {
  async sendMagicLink(email: string) {
    console.log('[FAKE AUTH] sendMagicLink', email)
  }

  async clickMagicLink() {
    console.log('[FAKE AUTH] login success')
  }

  async logout() {
    console.log('[FAKE AUTH] logout')
  }
}
