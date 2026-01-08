import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './AppearanceSection.scss'
import { useDashboardUnsaved } from '../../../contexts/DashboardUnsavedContext' 


import { useQuery } from '@tanstack/react-query'
import { getArtistBySlug } from '../../../services/artist.service'
import { Artist, ArtistTheme } from '../../../types/artist'

import AppearanceColors from './AppearanceColors'
import AppearanceImages from './AppearanceImages'

const artistSlug = 'mer'

type AppearanceTab = 'colors' | 'images'

export default function AppearanceSection() {

  const { t } = useTranslation()

  /* =======================
     FETCH ARTIST
  ======================= */

  const { data: artist } = useQuery<Artist>({
    queryKey: ['artist', artistSlug],
    queryFn: () => getArtistBySlug(artistSlug),
    staleTime: 10000,
  })

  /* =======================
     TAB STATE
  ======================= */

  const [tab, setTab] = useState<AppearanceTab>('colors')

  /* =======================
     THEME STATE
  ======================= */

  const [artistTheme, setArtistTheme] = useState<ArtistTheme | null>(null)
  const [initialTheme, setInitialTheme] = useState<ArtistTheme | null>(null)

  useEffect(() => {
    if (artist?.theme?.tokens) {
      setArtistTheme(artist.theme.tokens)
      setInitialTheme(artist.theme.tokens)
    }
  }, [artist])

  
  const isDirty =
  artistTheme &&
  initialTheme &&
  JSON.stringify(artistTheme) !== JSON.stringify(initialTheme)
  const { setIsDirty } = useDashboardUnsaved()
  
  /* =======================
     BEFORE UNLOAD WARNING
  ======================= */

  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () =>
      window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  useEffect(() => {
    setIsDirty(!!isDirty)
  }, [isDirty, setIsDirty])




  /* =======================
     IMAGES STATE
  ======================= */

  const [avatar, setAvatar] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)

  /* =======================
     HANDLERS
  ======================= */

  const handleSaveTheme = () => {
    console.log('save theme', artistTheme)
    // TODO: call API save theme
    // setInitialTheme(artistTheme)
  }

  const handleResetTheme = () => {
    if (initialTheme) {
      setArtistTheme({ ...initialTheme })
    }
  }

 const handleChangeTab = (nextTab: AppearanceTab) => {
  if (nextTab === tab) return

  if (isDirty) {
    const confirmLeave = window.confirm(
      t('dashboard.appearance.unsavedWarning') ||
        'You have unsaved changes. Are you sure you want to leave?'
    )

    if (!confirmLeave) return

    // 🔥 QUAN TRỌNG NHẤT:
    // 1. Reset draft local về snapshot
    if (initialTheme) {
      setArtistTheme({ ...initialTheme })
    }

    // 2. Clear dirty ở dashboard
    setIsDirty(false)
  }

  setTab(nextTab)
}




  /* =======================
     RENDER
  ======================= */

  return (
    <div className="appearance-section">
      <h2>{t('dashboard.appearance.title')}</h2>

      <div className="appearance-layout">
        {/* ===== SIDEBAR ===== */}
        <aside className="appearance-sidebar">
          <button
            className={tab === 'colors' ? 'active' : ''}
            onClick={() => handleChangeTab('colors')}
          >
            {t('dashboard.appearance.titleColor')}
            {isDirty && (
              <span className="appearance-tab-badge" />
            )}
          </button>

          <button
            className={tab === 'images' ? 'active' : ''}
            onClick={() => handleChangeTab('images')}
          >
            {t('dashboard.appearance.images')}
          </button>
        </aside>

        {/* ===== CONTENT ===== */}
        <div className="appearance-content">
          {tab === 'colors' && (
            <AppearanceColors
              artistSlug={artistSlug}
              artistTheme={artistTheme}
              setArtistTheme={setArtistTheme}
              isDirty={!!isDirty}
              onSave={handleSaveTheme}
              onReset={handleResetTheme}
            />
          )}

          {tab === 'images' && (
            <AppearanceImages
              avatar={avatar}
              cover={cover}
              setAvatar={setAvatar}
              setCover={setCover}
            />
          )}
        </div>
      </div>
    </div>
  )
}
