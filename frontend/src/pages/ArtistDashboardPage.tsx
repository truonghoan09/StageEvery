import DashboardLayout from '../layouts/DashboardLayout';
import { Outlet } from 'react-router-dom';

export default function ArtistDashboardPage() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
