const API_BASE = import.meta.env.VITE_API_BASE_URL

export interface SendMagicLinkResult {
  allowed: boolean
  retryAfter?: number
}

export async function requestSendMagicLink(): Promise<SendMagicLinkResult> {
  const res = await fetch(`${API_BASE}/auth/send-magic-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  // ⚠️ RATE LIMIT = EXPECTED FLOW
  if (res.status === 429) {
    return data
  }

  // ❌ Các lỗi khác mới là error thật
  if (!res.ok) {
    throw new Error('SEND_MAGIC_LINK_FAILED')
  }

  return data
}


export async function notifyLoginSuccess(idToken: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login-success`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  )

  if (!res.ok) {
    // Không throw – không block login UX
    console.warn('Failed to notify login success')
  }
}
