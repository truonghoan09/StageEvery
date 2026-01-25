// src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import ArtistPublicPage from '../pages/ArtistPublicPage';
import ArtistDashboardPage from '../pages/ArtistDashboardPage';

import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import ProfileSection from '../dashboard/sections/ProfileSection';
import MusicSection from '../dashboard/sections/MusicSection';
import ContactSection from '../dashboard/sections/ContactSection';
import PreviewSection from '../dashboard/sections/PreviewSection';
import AppearanceSection from '../dashboard/sections/appearance/AppearanceSection';
import SystemProfileSection from '../dashboard/sections/SystemProfileSection'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/artist/:slug" element={<ArtistPublicPage />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="/dashboard" element={<ArtistDashboardPage />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="system-profile" element={<SystemProfileSection />} />
          <Route path="appearance" element={<AppearanceSection />} />
          <Route path="music" element={<MusicSection />} />
          <Route path="contact" element={<ContactSection />} />
          <Route path="preview" element={<PreviewSection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
