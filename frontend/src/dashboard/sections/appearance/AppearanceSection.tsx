import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './AppearanceSection.scss'
import { useDashboardUnsaved } from '../../../contexts/DashboardUnsavedContext' 
import { getPaletteTokens } from '../../../config/getPaletteTokens'


import { useQuery } from '@tanstack/react-query'
import { getArtistBySlug } from '../../../services/artist.service'
import { Artist, ArtistTheme } from '../../../types/artist'

import AppearanceColors from './AppearanceColors'
import AppearanceImages from './AppearanceImages'
import AppearancePreview from './AppearancePreview'

import { updateArtistBySlug } from '../../../services/artist.service'

const artistSlug = 'mer'

type AppearanceTab = 'colors' | 'images'

export default function AppearanceSection() {

  const previewRef = React.useRef<HTMLDivElement>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const [paletteId, setPaletteId] = useState<string | null>(null)
  const [initialPaletteId, setInitialPaletteId] = useState<string | null>(null)


  const [isPreviewReady, setIsPreviewReady] = useState(false)


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

  const [tab, setTab] = useState<AppearanceTab>('images')

  /* =======================
     THEME STATE
  ======================= */

  const [artistTheme, setArtistTheme] = useState<ArtistTheme | null>(null)
  const [initialTheme, setInitialTheme] = useState<ArtistTheme | null>(null)


  useEffect(() => {
    const onReady = (e: MessageEvent) => {
      if (e.data?.type !== 'PREVIEW_READY') return
      setIsPreviewReady(true)
    }

    window.addEventListener('message', onReady)
    return () => window.removeEventListener('message', onReady)
  }, [])


  useEffect(() => {
    if (!isPreviewReady) return
    if (!iframeRef.current?.contentWindow) return
    if (!artistTheme) return

    iframeRef.current.contentWindow.postMessage(
      {
        type: 'PREVIEW_THEME_UPDATE',
        payload: artistTheme,
      },
      '*'
    )
  }, [artistTheme, isPreviewReady])



  useEffect(() => {
    if (!artist?.theme?.paletteId) return

    const id = artist.theme.paletteId
    const tokens = getPaletteTokens(id)

    if (!tokens) {
      console.warn('[AppearanceSection] Cannot resolve palette:', id)
      return
    }

    setPaletteId(id)
    setInitialPaletteId(id)
    setArtistTheme(tokens)
    setInitialTheme(tokens)
  }, [artist])

  
  const isDirty =
  !!artistTheme &&
  !!initialTheme &&
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

  const [initialAvatar, setInitialAvatar] = useState<File | null>(null)
  const [initialCover, setInitialCover] = useState<File | null>(null)

  const isImagesDirty = avatar !== initialAvatar || cover !== initialCover


  /* =======================
     HANDLERS
  ======================= */

  const handleSaveTheme = async () => {
    if (!paletteId) {
      console.warn('[SaveTheme] No paletteId to save')
      return
    }

    const payload = {
      theme: {
        paletteId,
      },
    }

    try {

      await updateArtistBySlug(artistSlug, payload)

      // ✅ update snapshot sau khi save thành công
      setInitialPaletteId(paletteId)
      setInitialTheme(artistTheme)

      // ✅ clear dirty state
      setIsDirty(false)
    } catch (error) {
      console.error('[SaveTheme] Failed to save theme', error)
      alert('Không thể lưu giao diện. Vui lòng thử lại.')
    }
  }


  const handleResetTheme = () => {
    if (initialTheme) {
      setArtistTheme({ ...initialTheme })
    }
  }

 const handleChangeTab = (nextTab: AppearanceTab) => {
  if (nextTab === tab) return

  const hasUnsavedChanges = isDirty || isImagesDirty

    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        t('dashboard.appearance.unsavedWarning') ||
          'You have unsaved changes. Are you sure you want to leave?'
      )

      if (!confirmLeave) return

      /* =========================
        RESET COLORS (THEME)
      ========================= */

      if (isDirty && initialTheme) {
        setArtistTheme({ ...initialTheme })
      }

      /* =========================
        RESET IMAGES
      ========================= */

      if (isImagesDirty) {
        setAvatar(initialAvatar)
        setCover(initialCover)
      }

      /* =========================
        CLEAR DIRTY FLAGS
      ========================= */

      setIsDirty(false)
    }

    setTab(nextTab)
  }

  const handlePaletteChange = (nextId: string) => {
    const tokens = getPaletteTokens(nextId)
    if (!tokens) return

    setPaletteId(nextId)
    setArtistTheme(tokens)
  }

  const handleSaveImages = () => {
    console.log('save images', avatar, cover)
    // TODO: upload API

    setInitialAvatar(avatar)
    setInitialCover(cover)
  }

  const handleResetImages = () => {
    setAvatar(initialAvatar)
    setCover(initialCover)
  }



  /* =======================
     RENDER
  ======================= */

  return (
    <div className="appearance-section">
      <h2>{t('dashboard.appearance.title')}</h2>

      {/* 🔥 CHỈ SỬA 1 VIỆC:
          appearance-left + appearance-right
          cùng nằm trong appearance-shell
      */}
      <div className="appearance-shell">

        {/* ===== LEFT COLUMN ===== */}
        <div className="appearance-left">
          <aside className="appearance-sidebar">
            <button
              className={tab === 'images' ? 'active' : ''}
              onClick={() => handleChangeTab('images')}
            >
              {t('dashboard.appearance.images')}
              {isImagesDirty && <span className="appearance-tab-badge" />}
            </button>

            <button
              className={tab === 'colors' ? 'active' : ''}
              onClick={() => handleChangeTab('colors')}
            >
              {t('dashboard.appearance.titleColor')}
              {isDirty && <span className="appearance-tab-badge" />}
            </button>
          </aside>

          <div className="appearance-content">
            {tab === 'colors' && (
              <AppearanceColors
                artistTheme={artistTheme}
                paletteId={paletteId}
                isDirty={isDirty}
                onPaletteChange={handlePaletteChange}
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
                isDirty={isImagesDirty}
                onSave={handleSaveImages}
                onReset={handleResetImages}
              />
            )}
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="appearance-right">
          <div className="preview-device-toggle">
            {(['desktop', 'tablet', 'mobile'] as const).map(d => (
              <button
                key={d}
                className={device === d ? 'active' : ''}
                onClick={() => setDevice(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          <div ref={previewRef}>
            <AppearancePreview
              ref={iframeRef}
              slug={artistSlug}
              device={device}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
