import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../../contexts/AuthContext'
import GoogleLoginButton from '../../components/GoogleLoginButton'
import './LoginPage.scss'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">
          {t('auth.login.title')}
        </h1>

        <p className="login-subtitle">
          {t('auth.login.subtitle')}
        </p>

        <div className="login-google">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  )
}
