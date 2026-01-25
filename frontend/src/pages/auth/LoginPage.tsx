import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDuration } from '../../utils/formatDuration'

import { useAuth } from '../../contexts/AuthContext'
import './LoginPage.scss'
import { FloatingInput } from '../../components/FloatingInput'
import { requestSendMagicLink } from '../../services/auth.service'

function normalizeEmail(
  input: string,
  t: (key: string, options?: any) => string
): {
  email: string | null
  error: string | null
} {
  const value = input.trim().toLowerCase()

  if (!value) {
    return {
      email: null,
      error: t('auth.login.errors.required'),
    }
  }

  // Auto append @gmail.com nếu chưa có @
  const email = value.includes('@')
    ? value
    : `${value}@gmail.com`

  // Chỉ cho phép gmail
  if (!email.endsWith('@gmail.com')) {
    return {
      email: null,
      error: t('auth.login.errors.gmailOnly'),
    }
  }

  const username = email.replace('@gmail.com', '')

  // ===== RULE GMAIL OFFICIAL =====

  // Độ dài 6–30 ký tự
  if (username.length < 6 || username.length > 30) {
    return {
      email: null,
      error: t('auth.login.errors.length'),
    }
  }

  // Chỉ chữ, số, dấu chấm
  if (!/^[a-z0-9.]+$/.test(username)) {
    return {
      email: null,
      error: t('auth.login.errors.characters'),
    }
  }

  // Không bắt đầu / kết thúc bằng dấu chấm
  if (
    username.startsWith('.') ||
    username.endsWith('.')
  ) {
    return {
      email: null,
      error: t('auth.login.errors.dotEdge'),
    }
  }

  // Không có 2 dấu chấm liên tiếp
  if (username.includes('..')) {
    return {
      email: null,
      error: t('auth.login.errors.dotConsecutive'),
    }
  }

  // ===== HẾT RULE GMAIL =====

  return { email, error: null }
}

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    flow,
    isAuthenticated,
    sendMagicLink,
    clickMagicLink,
  } = useAuth()

  const [input, setInput] = useState('')
  const [email, setEmail] = useState<string | null>(null)
  type LoginError =
  | { type: 'validation'; message: string }
  | { type: 'rate_limit'; message: string }
  | { type: 'send_fail'; message: string }

  const [error, setError] = useState<LoginError | null>(null)
  const [cooldown, setCooldown] = useState(0)

  /* =========================================================
     REDIRECT AFTER LOGIN
  ========================================================= */

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  /* =========================================================
     COOLDOWN TIMER
  ========================================================= */

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((c) => c - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  /* =========================================================
     SEND (FAKE)
  ========================================================= */

  const handleSend = async () => {
    if (flow !== 'idle' && flow !== 'email_sent') return

    const result = normalizeEmail(input, t)

    if (result.error) {
      setError({
        type: 'validation',
        message: result.error,
      })
      setEmail(null)
      return
    }

    try {
      const gate = await requestSendMagicLink()

      if (!gate.allowed) {
        const seconds = gate.retryAfter ?? 60

        setError({
          type: 'rate_limit',
          message: t('auth.login.errors.tooManyAttempts'),
        })

        setEmail(null)
        setCooldown(seconds)
        return
      }

      setError(null)
      setEmail(result.email!)

      sendMagicLink(result.email!)
      setCooldown(60)
    } catch {
      setError({
        type: 'send_fail',
        message: t('auth.login.errors.sendFail'),
      })
    }
  }




  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">
          {t('auth.login.title')}
        </h1>

        <p className="login-subtitle">
          {t('auth.login.subtitle')}
        </p>

        {flow === 'idle' && (
          <>
            <FloatingInput
              id="email"
              label={t('auth.login.placeholder')}
              value={input}
              onChange={setInput}
              error={error?.type === 'validation' ? error.message : null}
              onEnter={handleSend}
            />

            {error && (
              <p className="login-error">{error.message}</p>
            )}

            <button
              className="login-button"
              onClick={handleSend}
              disabled={error?.type === 'rate_limit'}
            >
              {error?.type === 'rate_limit'
                ? t('auth.login.status.resendIn', { time: formatDuration(cooldown)})
                : t('auth.login.submit')}
            </button>
          </>
        )}


        {flow === 'sending_email' && (
          <p className="login-status">
            {t('auth.login.status.sending')}
          </p>
        )}

        {flow === 'email_sent' && (
          <>
            <div className="login-success">
              <p>{t('auth.login.status.sent')}</p>
              <strong>{email}</strong>
            </div>

            <button
              className="login-link"
              onClick={handleSend}
              disabled={cooldown > 0 || error?.type === 'rate_limit'}
            >
              {cooldown > 0
                ? t('auth.login.status.resendIn', {
                    time: formatDuration(cooldown),
                  })
                : t('auth.login.status.resend')}
            </button>

          </>
        )}

        {flow === 'email_failed' && error?.type === 'send_fail' && (
          <>
            <p className="login-error">{error.message}</p>

            <button
              className="login-button"
              onClick={handleSend}
            >
              {t('auth.login.status.resend')}
            </button>
          </>
        )}

        <div className="login-register">
          <span>
            {t('auth.login.noAccount')}
          </span>
          <button
            type="button"
            className="login-register-link"
            onClick={() => navigate('/auth/register')}
          >
            {t('auth.login.createProfile')}
          </button>
        </div>
      </div>
    </div>
  )
}
