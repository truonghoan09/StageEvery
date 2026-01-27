import { ReactNode, useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useDashboardUnsaved } from '../contexts/DashboardUnsavedContext'
import { useAuth } from '../contexts/AuthContext'

import './DashboardLayout.scss'

type Props = {
  children:
    | ReactNode
    | ((args: { refreshSystemProfile: () => Promise<void> }) => ReactNode)
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

  useEffect(() => {
    if (!isAuthenticated) return

    const checkSystemProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/me`,
          {
            headers: {
              'x-user-id': localStorage.getItem('userId') ?? '',
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
  }, [isAuthenticated, location.pathname])

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
            'x-user-id': localStorage.getItem('userId') ?? '',
          },
        }
      )
      const data = await res.json()
      setHasSystemProfile(data.hasProfile)
    } catch {
      // ignore
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (hasSystemProfile === null) {
    return <div style={{ padding: 24 }}>Loading...</div>
  }

  return (
    <div className="dashboard-layout">
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
                  handleNavClick(
                    e,
                    '/dashboard/system-profile'
                  )
                }
              >
                System Profile
              </NavLink>
            </li>

            {[
              'profile',
              'appearance',
              'music',
              'contact',
              'preview',
            ].map((key) => {
              const path = `/dashboard/${key}`
              return (
                <li key={key}>
                  <NavLink
                    to={path}
                    onClick={(e) => {
                      if (isLocked(path)) {
                        e.preventDefault()
                        return
                      }
                      handleNavClick(e, path)
                    }}
                    className={isLocked(path) ? 'disabled' : ''}
                    title={
                      isLocked(path)
                        ? t(
                            'dashboard.systemProfileRequired'
                          )
                        : undefined
                    }
                  >
                    {t(`dashboard.layout.${key}`)}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="dashboard-logout">
          <button
            className="dashboard-logout-button"
            onClick={() => {
              logout()
              navigate('/auth/login', { replace: true })
            }}
          >
            Logout
          </button>
        </div>
      </aside>

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
              onClick={() =>
                navigate('/dashboard/system-profile')
              }
            >
              {t('dashboard.completeProfile')}
            </button>
          </div>
        )}

        {hasSystemProfile === false &&
          location.pathname !== '/dashboard/system-profile' ? (
            <Navigate
              to="/dashboard/system-profile"
              replace
            />
          ) : typeof children === 'function' ? (
            children({ refreshSystemProfile })
          ) : (
            children
          )}
      </main>
    </div>
  )
}
