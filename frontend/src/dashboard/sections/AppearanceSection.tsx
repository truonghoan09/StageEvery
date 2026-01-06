import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './AppearanceSection.scss'
import AppearancePreview from './AppearancePreview'
import { useContainerSize } from '../../hooks/useContainerSize'

import { useQuery } from '@tanstack/react-query'
import { getArtistBySlug } from '../../services/artist.service'
import { Artist, ArtistTheme } from '../../types/artist'
import { useRef } from 'react'

const artistSlug = 'mer'

/* =======================
   THEME TYPES
======================= */



const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
}

/* =======================
   COMPONENT
======================= */

export default function AppearanceSection() {
  const { t } = useTranslation()
  const {
  data: artist,
  isLoading: isArtistLoading,
  isError: isArtistError,
} = useQuery<Artist>({
  queryKey: ['artist', artistSlug],
  queryFn: () => getArtistBySlug(artistSlug),
  staleTime: 10000,
})

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const { ref: previewRef, size } = useContainerSize<HTMLDivElement>()

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  

  /* =======================
     SCALE (DESKTOP IS BASE)
  ======================= */

  const desktopViewport = VIEWPORTS.desktop

  const desktopScale =
    size.width > 0 && size.height > 0
      ? Math.min(
          size.width / desktopViewport.width,
          size.height / desktopViewport.height
        )
      : 1

  /* =======================
     STATE
  ======================= */

  const [artistTheme, setArtistTheme] = useState<ArtistTheme | null>(null)

  useEffect(() => {
    if (artist?.theme?.tokens) {
      setArtistTheme(artist.theme.tokens)
    }

  }, [artist])


  const [avatar, setAvatar] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)

  const avatarPreview = useMemo(
    () => (avatar ? URL.createObjectURL(avatar) : null),
    [avatar]
  )

  const coverPreview = useMemo(
    () => (cover ? URL.createObjectURL(cover) : null),
    [cover]
  )

  /* =======================
     HELPERS
  ======================= */


  const updateArtistTheme = (key: keyof ArtistTheme, value: string) => {
    setArtistTheme(prev => {
      if (!prev) return prev // ⛔ chưa load DB → không cho update
      return {
        ...prev,
        [key]: value,
      }
    })
  }

  useEffect(() => {
    if (!artistTheme) return
    if (!iframeRef.current?.contentWindow) return

    iframeRef.current.contentWindow.postMessage(
      {
        type: 'PREVIEW_THEME',
        tokens: artistTheme,
      },
      '*'
    )
  }, [artistTheme])


  /* =======================
     RENDER
  ======================= */

  return (
    <div
      className="appearance-section"
    >
      <h2>{t('dashboard.appearance.title')}</h2>

      {/* ===== TOP: COLORS + PREVIEW ===== */}
      <div className="appearance-grid">
        {/* LEFT – COLORS */}
        {!artistTheme && (
          <div className="appearance-block">
            <p>Đang tải màu giao diện…</p>
          </div>
        )}

        {artistTheme && (
        <div className="appearance-controls appearance-controls--colors">
          <div className="appearance-block">
            <h3>{t('dashboard.appearance.dashboardTheme')}</h3>

            <div className="color-row">
              <label>{t('dashboard.appearance.bg')}</label>
              <input
                type="color"
                value={artistTheme.bg}
                onChange={(e) =>
                  updateArtistTheme('bg', e.target.value)
                }
              />
            </div>

            <div className="color-row">
              <label>{t('dashboard.appearance.bgSoft')}</label>
              <input
                type="color"
                value={artistTheme.bgSoft}
                onChange={(e) =>
                  updateArtistTheme('bgSoft', e.target.value)
                }
              />
            </div>

            <div className="color-row">
              <label>{t('dashboard.appearance.primary')}</label>
              <input
                type="color"
                value={artistTheme.primary}
                onChange={(e) =>
                  updateArtistTheme('primary', e.target.value)
                }
              />
            </div>

            <div className="color-row">
              <label>{t('dashboard.appearance.text')}</label>
              <input
                type="color"
                value={artistTheme.text}
                onChange={(e) =>
                  updateArtistTheme('text', e.target.value)
                }
              />
            </div>

            <div className="color-row">
              <label>{t('dashboard.appearance.textSoft')}</label>
              <input
                type="color"
                value={artistTheme.textSoft}
                onChange={(e) =>
                  updateArtistTheme('textSoft', e.target.value)
                }
              />
            </div>

            <div className="color-row">
              <label>{t('dashboard.appearance.textMuted')}</label>
              <input
                type="color"
                value={artistTheme.textMuted}
                onChange={(e) =>
                  updateArtistTheme('textMuted', e.target.value)
                }
              />
            </div>
          </div>
        </div>)}

        {/* RIGHT – PREVIEW */}
        <div className="appearance-preview" ref={previewRef}>
          <div className="preview-device-toggle">
            <button
              className={device === 'desktop' ? 'active' : ''}
              onClick={() => setDevice('desktop')}
            >
              Desktop
            </button>

            <button
              className={device === 'tablet' ? 'active' : ''}
              onClick={() => setDevice('tablet')}
            >
              Tablet
            </button>

            <button
              className={device === 'mobile' ? 'active' : ''}
              onClick={() => setDevice('mobile')}
            >
              Mobile
            </button>
          </div>

          <AppearancePreview
            ref={iframeRef}
            slug={artistSlug}
            device={device}
            desktopScale={desktopScale}
          />
        </div>
      </div>

      {/* ===== BOTTOM: IMAGES ===== */}
      <div className="appearance-images">
        <div className="appearance-block">
          <h3>{t('dashboard.appearance.images')}</h3>

          <div className="file-row">
            <label>{t('dashboard.appearance.avatar')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setAvatar(e.target.files?.[0] || null)
              }
            />
          </div>

          <div className="file-row">
            <label>{t('dashboard.appearance.cover')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCover(e.target.files?.[0] || null)
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
