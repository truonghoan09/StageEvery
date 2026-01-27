import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import './GoogleLoginButton.scss'

export default function GoogleLoginButton() {
  const { login } = useAuth()

  return (
    <div className="google-login-wrapper">
      {/* Google OAuth popup engine (hidden UI) */}
      <div style={{ display: 'none' }}>
        <GoogleLogin
          onSuccess={(res) => {
            if (!res.credential) return
            login(res.credential)
          }}
          onError={() => {
            console.error('[GOOGLE LOGIN] failed')
          }}
          useOneTap={false}
          type="standard"
          theme="outline"
          size="large"
          text="continue_with"
          containerProps={{
            id: 'google-login-hidden-btn',
          }}
        />
      </div>

      {/* Custom UI */}
      <button
        className="google-login-button"
        type="button"
        onClick={() => {
          const btn = document
            .getElementById('google-login-hidden-btn')
            ?.querySelector('div[role="button"]') as HTMLElement | null

          btn?.click()
        }}
      >
        <span className="google-icon">
          <svg viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.7 1.22 9.2 3.22l6.85-6.85C35.9 2.34 30.47 0 24 0 14.6 0 6.48 5.38 2.56 13.22l7.98 6.2C12.36 13.09 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.1 24.55c0-1.64-.15-3.22-.42-4.75H24v9h12.4c-.54 2.9-2.16 5.36-4.6 7.04l7.05 5.48C43.92 36.62 46.1 30.96 46.1 24.55z"
            />
            <path
              fill="#FBBC05"
              d="M10.54 28.22a14.4 14.4 0 010-8.44l-7.98-6.2a24.02 24.02 0 000 20.84l7.98-6.2z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.9-2.14 15.86-5.82l-7.05-5.48c-1.96 1.32-4.48 2.1-8.8 2.1-6.26 0-11.64-3.58-13.46-8.92l-7.98 6.2C6.48 42.62 14.6 48 24 48z"
            />
          </svg>
        </span>

        <span className="google-text">
          Continue with Google
        </span>
      </button>
    </div>
  )
}
