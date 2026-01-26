import { USE_FAKE_AUTH } from '../config/auth.config'
import { FakeAuthAdapter } from './FakeAuthAdapter'
import { FirebaseAuthAdapter } from './FirebaseAuthAdapter'
import { AuthAdapter } from './AuthAdapter'

let adapter: AuthAdapter | null = null

export function getAuthAdapter(): AuthAdapter {
  if (adapter) return adapter

  adapter = USE_FAKE_AUTH
    ? new FakeAuthAdapter()
    : new FirebaseAuthAdapter()

  return adapter
}
