const API_BASE = import.meta.env.VITE_API_BASE_URL

export interface SystemProfilePayload {
  firstName: string
  lastName: string
  phone: string
  dob: string
}

export interface SystemProfile {
  firstName: string
  lastName: string
  phone: string
  dob: string
}

function authHeaders(): HeadersInit {
  const h: Record<string, string> = {}
  const userId = localStorage.getItem('userId')
  if (userId) h['x-user-id'] = userId
  return h
}

export async function createSystemProfile(
  payload: SystemProfilePayload
) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('CREATE_PROFILE_FAILED')
}

export async function getSystemProfile(): Promise<SystemProfile | null> {
  const res = await fetch(`${API_BASE}/me`, {
    headers: authHeaders(),
  })

  if (!res.ok) return null

  const data = await res.json()
  if (!data.user) return null

  return {
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    phone: data.user.phone,
    dob: data.user.dob,
  }
}
