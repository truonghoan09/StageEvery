const API_BASE = import.meta.env.VITE_API_BASE_URL

export interface SystemProfilePayload {
  firstName: string
  lastName: string
  phone: string
  dob: string
}

export async function createSystemProfile(
  payload: SystemProfilePayload
) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem('firebaseIdToken') ?? ''
      }`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('CREATE_PROFILE_FAILED')
  }
}

export interface SystemProfile {
  firstName: string
  lastName: string
  phone: string
  dob: string
}

export async function getSystemProfile(): Promise<SystemProfile | null> {
  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem('firebaseIdToken') ?? ''
      }`,
    },
  })

  const data = await res.json()

  if (!data.hasProfile || !data.user) {
    return null
  }

  return {
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    phone: data.user.phone,
    dob: data.user.dob,
  }
}
