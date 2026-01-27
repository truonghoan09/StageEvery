export interface AuthAdapter {
  login(idToken: string): Promise<any>
  logout(): Promise<void>
}
