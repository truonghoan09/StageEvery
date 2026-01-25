import { ReactNode, useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useDashboardUnsaved } from '../contexts/DashboardUnsavedContext'
import { useAuth } from '../contexts/AuthContext'

import './DashboardLayout.scss'

type Props = {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const { t } = useTranslation()

  const navigate = useNavigate()
  const location = useLocation()

  const { isDirty, setIsDirty } = useDashboardUnsaved()

  const { isAuthenticated, logout } = useAuth()
  const [hasSystemProfile, setHasSystemProfile] =
  useState<boolean | null>(null)


  const [missingFields, setMissingFields] = useState<string[]>([])



  /* =========================================================
     AUTH GUARD (FAKE)
     - chưa login thì redirect sang /auth/login
  ========================================================= */

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (
    hasSystemProfile === false &&
    location.pathname !== '/dashboard/system-profile'
  ) {
    return <Navigate to="/dashboard/system-profile" replace />
  }

  useEffect(() => {
  if (!isAuthenticated) return

  const checkSystemProfile = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('firebaseIdToken') ?? ''}`,
          },
        }
      )

      const data = await res.json()
      setHasSystemProfile(data.hasProfile)
      setMissingFields(data.missingFields ?? [])
    } catch (err) {
      console.error('[DASHBOARD] /me failed', err)
      setHasSystemProfile(false)
    }
  }

  checkSystemProfile()
}, [isAuthenticated])

  /* =========================================================
     NAV HANDLER (GIỮ NGUYÊN LOGIC CŨ)
  ========================================================= */

  const handleNavClick = (
    e: React.MouseEvent,
    to: string
  ) => {
    if (location.pathname === to) return

    if (isDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      )

      if (!confirmLeave) {
        e.preventDefault()
        return
      }

      // 🔥 CLEAR DIRTY VÌ USER ĐÃ CHẤP NHẬN BỎ THAY ĐỔI
      setIsDirty(false)
    }

    e.preventDefault()
    navigate(to)
  }
  
  const isLocked = (path: string) => {
    if (hasSystemProfile !== false) return false
    return path !== '/dashboard/system-profile'
  }


  const refreshSystemProfile = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('firebaseIdToken') ?? ''}`,
          },
        }
      )
      const data = await res.json()
      setHasSystemProfile(data.hasProfile)
    } catch {
      // ignore
    }
  }

  
    /* =========================================================
       RENDER
    ========================================================= */

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        
        <h2 className="dashboard-title">
          {t('dashboard.layout.title')}
        </h2>

        <nav>
          <ul className="dashboard-nav">
            <li>
              <NavLink
                to="/dashboard/system-profile"
                onClick={(e) =>
                  handleNavClick(e, '/dashboard/system-profile')
                }
              >
                System Profile
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/profile"
                onClick={(e) => {
                  if (isLocked('/dashboard/profile')) {
                    e.preventDefault()
                    return
                  }
                  handleNavClick(e, '/dashboard/profile')
                }}
                className={isLocked('/dashboard/profile') ? 'disabled' : ''}
                title={
                  isLocked('/dashboard/profile')
                    ? t('dashboard.systemProfileRequired')
                    : undefined
                }
              >
                {t('dashboard.layout.profile')}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/appearance"
                onClick={(e) => {
                  if (isLocked('/dashboard/appearance')) {
                    e.preventDefault()
                    return
                  }
                  handleNavClick(e, '/dashboard/appearance')
                }}
                className={isLocked('/dashboard/appearance') ? 'disabled' : ''}
                title={
                  isLocked('/dashboard/appearance')
                    ? t('dashboard.systemProfileRequired')
                    : undefined
                }
              >
                {t('dashboard.layout.appearance')}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/music"
                onClick={(e) => {
                  if (isLocked('/dashboard/music')) {
                    e.preventDefault()
                    return
                  }
                  handleNavClick(e, '/dashboard/music')
                }}
                className={isLocked('/dashboard/music') ? 'disabled' : ''}
                title={
                  isLocked('/dashboard/music')
                    ? t('dashboard.systemProfileRequired')
                    : undefined
                }
              >
                {t('dashboard.layout.music')}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/contact"
                onClick={(e) => {
                  if (isLocked('/dashboard/contact')) {
                    e.preventDefault()
                    return
                  }
                  handleNavClick(e, '/dashboard/contact')
                }}
                className={isLocked('/dashboard/contact') ? 'disabled' : ''}
                title={
                  isLocked('/dashboard/contact')
                    ? t('dashboard.systemProfileRequired')
                    : undefined
                }
              >
                {t('dashboard.layout.contact')}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/preview"
                onClick={(e) => {
                  if (isLocked('/dashboard/preview')) {
                    e.preventDefault()
                    return
                  }
                  handleNavClick(e, '/dashboard/preview')
                }}
                className={isLocked('/dashboard/preview') ? 'disabled' : ''}
                title={
                  isLocked('/dashboard/preview')
                    ? t('dashboard.systemProfileRequired')
                    : undefined
                }
              >
                {t('dashboard.layout.preview')}
              </NavLink>
            </li>
          </ul>
        </nav>

      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {hasSystemProfile === false && (
          <div className="dashboard-warning">
            <span>
              ⚠️ {t('dashboard.systemProfileRequired')}
              {missingFields.length > 0 && (
                <> ({missingFields.length} required)</>
              )}
            </span>
            <button
              onClick={() => navigate('/dashboard/system-profile')}
            >
              {t('dashboard.completeProfile')}
            </button>
          </div>
        )}

        {typeof children === 'function'
        ? children({ refreshSystemProfile })
        : children}
      </main>
    </div>
  )
}
