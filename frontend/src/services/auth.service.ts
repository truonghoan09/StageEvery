const API_BASE = import.meta.env.VITE_API_BASE_URL

// ======================
// Types
// ======================

export interface GoogleLoginResult {
  user: {
    id: string
    email: string
    name: string
    avatar?: string | null
  }
}

// ======================
// APIs
// ======================

/**
 * Login / Signup via Google OAuth
 * @param idToken Google ID token from popup
 */
export async function loginWithGoogle(
  idToken: string
): Promise<GoogleLoginResult> {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  })

  if (!res.ok) {
    throw new Error('GOOGLE_LOGIN_FAILED')
  }

  const data = await res.json()

  // 🔑 Lưu userId để dùng cho auth middleware (MVP)
  localStorage.setItem('userId', data.user.id)

  return data
}

/**
 * Logout (frontend only – MVP)
 */
export function logout() {
  localStorage.removeItem('userId')
}