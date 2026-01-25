import React from 'react'
import { useTranslation } from 'react-i18next'

import { ArtistTheme } from '../../../types/artist'
import { getPaletteOptions } from '../../../config/getPaletteTokens'

type Props = {
  artistTheme: ArtistTheme | null
  paletteId: string | null
  isDirty: boolean

  onPaletteChange: (paletteId: string) => void
  onSave: () => void
  onReset: () => void
}

export default function AppearanceColors({
  artistTheme,
  paletteId,
  isDirty,
  onPaletteChange,
  onSave,
  onReset,
}: Props) {
  const { t } = useTranslation()
  const paletteOptions = getPaletteOptions()

  return (
    <div className="blockColor">
      <h3>{t('dashboard.appearance.titleColor')}</h3>

      <div className="appearance-grid">
        {!artistTheme && (
          <div className="appearance-block">
            <p>{t('dashboard.appearance.loadingTheme')}</p>
          </div>
        )}

        {artistTheme && (
          <div className="appearance-controls appearance-controls--colors">
            <div className="appearance-block">
              <div className="row">
                <label>{t('dashboard.appearance.theme')}</label>

                <div className="color-row">
                  <select
                    value={paletteId ?? ''}
                    className={!paletteId ? 'is-placeholder' : ''}
                    onChange={(e) => {
                      const nextId = e.target.value
                      if (!nextId) return
                      onPaletteChange(nextId)
                    }}
                  >
                    <option value="" disabled hidden>
                      {t('dashboard.appearance.selectTheme')}
                    </option>

                    {paletteOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {t(
                          `dashboard.appearance.palette.${p.id.replace(
                            /-([a-z])/g,
                            (_, c) => c.toUpperCase()
                          )}`
                        )}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="appearance-actions">
        <button disabled={!isDirty} onClick={onSave}>
          {t('dashboard.appearance.actions.save')}
        </button>
        <button disabled={!isDirty} onClick={onReset}>
          {t('dashboard.appearance.actions.reset')}
        </button>
      </div>
    </div>
  )
}
