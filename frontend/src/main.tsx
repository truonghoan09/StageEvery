import './i18n'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { ThemeProvider } from './contexts/ThemeContext'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'

import './styles/global.scss'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <HelmetProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </HelmetProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
