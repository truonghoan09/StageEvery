import { Outlet } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import {
  DashboardUnsavedProvider,
} from '../contexts/DashboardUnsavedContext'



export default function ArtistDashboardPage() {
  return (
    <DashboardUnsavedProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </DashboardUnsavedProvider>
  )
}
