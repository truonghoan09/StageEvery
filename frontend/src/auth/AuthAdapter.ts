export interface AuthAdapter {
  sendMagicLink(email: string): Promise<void>
  clickMagicLink(): Promise<void>
  logout(): Promise<void>
}
