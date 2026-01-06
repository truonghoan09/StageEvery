import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './DashboardLayout.scss';

export default function DashboardLayout() {
  const { t } = useTranslation();


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
              <NavLink to="/dashboard/profile">
                {t('dashboard.layout.profile')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/appearance">
                {t('dashboard.layout.appearance')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/music">
                {t('dashboard.layout.music')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/contact">
                {t('dashboard.layout.contact')}
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/preview">
                {t('dashboard.layout.preview')}
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
          <Outlet />
      </main>
    </div>
  );
}
