import { ReactNode } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDashboardUnsaved } from '../contexts/DashboardUnsavedContext';
import { useTranslation } from 'react-i18next';

import './DashboardLayout.scss';

type Props = {
  children: ReactNode
}



export default function DashboardLayout({ children }: Props) {
  const { t } = useTranslation();

  const navigate = useNavigate()
  const location = useLocation()
  const { isDirty, setIsDirty } = useDashboardUnsaved()

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
                to="/dashboard/profile"
                onClick={(e) =>
                  handleNavClick(e, '/dashboard/profile')
                }
              >
                {t('dashboard.layout.profile')}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/appearance"
                onClick={(e) =>
                  handleNavClick(e, '/dashboard/appearance')
                }
              >
                {t('dashboard.layout.appearance')}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/music"
                onClick={(e) =>
                  handleNavClick(e, '/dashboard/music')
                }
              >
                {t('dashboard.layout.music')}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/contact"
                onClick={(e) =>
                  handleNavClick(e, '/dashboard/contact')
                }
              >
                {t('dashboard.layout.contact')}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/preview"
                onClick={(e) =>
                  handleNavClick(e, '/dashboard/preview')
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
        {children}
      </main>
    </div>
  );
}
