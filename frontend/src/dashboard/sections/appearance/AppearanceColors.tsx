import React, { useEffect, useRef, useState } from 'react'
import AppearancePreview from './AppearancePreview'
import { ArtistTheme } from '../../../types/artist'
import { useContainerSize } from '../../../hooks/useContainerSize'
import { useTranslation } from 'react-i18next'

type Props = {
  artistSlug: string
  artistTheme: ArtistTheme | null
  setArtistTheme: React.Dispatch<React.SetStateAction<ArtistTheme | null>>
  isDirty: boolean
  onSave: () => void
  onReset: () => void
}

const VIEWPORTS = {
    desktop: { width: 1280, height: 800 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 812 },
  }

export default function AppearanceColors({
  artistSlug,
  artistTheme,
  setArtistTheme,
  isDirty,
  onSave,
  onReset,
}: Props) {
  const { t } = useTranslation()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const { ref: previewRef, size } = useContainerSize<HTMLDivElement>()
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const updateArtistTheme = (key: keyof ArtistTheme, value: string) => {
    setArtistTheme(prev => (prev ? { ...prev, [key]: value } : prev))
  }

  useEffect(() => {
    if (!artistTheme || !iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      { type: 'PREVIEW_THEME', tokens: artistTheme },
      '*'
    )
  }, [artistTheme])

  const desktopViewport = VIEWPORTS.desktop

  const desktopScale =
    size.width > 0 && size.height > 0
      ? Math.min(
          size.width / desktopViewport.width,
          size.height / desktopViewport.height
        )
      : 1


  return (
    <div className="blockColor">
        <h3>{t('dashboard.appearance.titleColor')}</h3>

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

        <div className='appearance-actions'>
            <button
            disabled={!isDirty}
            onClick={onSave}
            >
            Save changes
            </button>
            <button
            disabled={!isDirty}
            onClick={onReset}
            >
            Reset
            </button>
        </div>

    </div>
  )
}
