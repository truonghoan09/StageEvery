import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[Register] email:', email)
    // TODO: create artist + send magic link
  }

  return (
    <>
      <h1>{t('auth.register.title', 'Create account')}</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t('auth.email', 'Email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">
          {t('auth.register.submit', 'Get started')}
        </button>
      </form>
    </>
  )
}
