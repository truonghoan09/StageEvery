import './ContactSection.scss'
import InfoIcon from '../../components/InfoIcon'
import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useDashboardUnsaved } from '../../contexts/DashboardUnsavedContext'

import { Artist } from '../../types/artist'
import {
  getArtistBySlug,
  updateArtistBySlug,
} from '../../services/artist.service'

export default function ContactSection() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { setIsDirty } = useDashboardUnsaved()

  const ARTIST_SLUG = 'mer'

  const [initialData, setInitialData] = useState<any>(null)
  const [justSaved, setJustSaved] = useState(false)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [socials, setSocials] = useState<any>({
    email: '',
    facebook: '',
    instagram: '',
    spotify: '',
    soundcloud: '',
    youtube: '',
  })

  /* =======================
     FETCH ARTIST
  ======================= */

  const { data: artist, isLoading } = useQuery<Artist>({
    queryKey: ['artist-dashboard', ARTIST_SLUG],
    queryFn: () => getArtistBySlug(ARTIST_SLUG),
  })

  /* =======================
     HYDRATE SNAPSHOT
  ======================= */

  useEffect(() => {
    if (!artist) return

    const snapshot = {
      socials: {
        email: artist.socials?.email || '',
        facebook: artist.socials?.facebook || '',
        instagram: artist.socials?.instagram || '',
        spotify: artist.socials?.spotify || '',
        soundcloud: artist.socials?.soundcloud || '',
        youtube: artist.socials?.youtube || '',
      },
    }

    setInitialData(snapshot)
    setSocials(snapshot.socials)
  }, [artist])

  /* =======================
     DIRTY DETECTION
  ======================= */

  const isDirty = useMemo(() => {
    if (!initialData) return false
    return JSON.stringify(socials) !== JSON.stringify(initialData.socials)
  }, [socials, initialData])

  /* =======================
     SYNC DIRTY → DASHBOARD
  ======================= */

  useEffect(() => {
    setIsDirty(isDirty)
  }, [isDirty, setIsDirty])

  /* =======================
     BEFORE UNLOAD
  ======================= */

  useEffect(() => {
    if (!isDirty) return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  /* =======================
     MUTATION
  ======================= */

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      updateArtistBySlug(ARTIST_SLUG, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['artist-dashboard', ARTIST_SLUG],
      })

      // 🔥 UPDATE SNAPSHOT
      setInitialData({ socials })

      // 🔥 CLEAR DIRTY
      setIsDirty(false)

      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    },

    onError: (error: any) => {
      const res =
        error?.data ||
        error?.response?.data ||
        error

      if (!res?.field) return

      setErrors(prev => ({
        ...prev,
        [`socials.${res.field}`]: res.message,
      }))
    },
  })

  /* =======================
     RESET
  ======================= */

  const handleReset = () => {
    if (!initialData) return
    setSocials(initialData.socials)
    setErrors({})
    setIsDirty(false)
  }

  /* =======================
     RENDER
  ======================= */

  if (isLoading) {
    return <p>{t('dashboard.contact.loading')}</p>
  }

  return (
    <section className="dashboard-contact">
      <h2>{t('dashboard.contact.title')}</h2>

      <div className="section">
        <div className="section-title">
          {t('dashboard.contact.section')}
        </div>

        <div className="contact-grid">
          <div className="form-group">
            <label>
              {t('dashboard.contact.email')}
              <InfoIcon text={t('dashboard.contact.emailHint')} />
            </label>
            <input
              type="email"
              value={socials.email}
              onChange={e =>
                setSocials({ ...socials, email: e.target.value })
              }
            />
          </div>

          {[
            'facebook',
            'instagram',
            'spotify',
            'soundcloud',
            'youtube',
          ].map(key => (
            <div className="form-group" key={key}>
              <label>{t(`dashboard.contact.${key}`)}</label>
              <input
                type="url"
                value={socials[key]}
                className={errors[`socials.${key}`] ? 'error' : ''}
                onChange={e => {
                  setSocials({ ...socials, [key]: e.target.value })
                  setErrors(prev => {
                    const next = { ...prev }
                    delete next[`socials.${key}`]
                    return next
                  })
                }}
              />
              {errors[`socials.${key}`] && (
                <div className="field-error">
                  {errors[`socials.${key}`]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button
          disabled={!isDirty || updateMutation.isPending}
          onClick={() =>
            updateMutation.mutate({ socials })
          }
        >
          {updateMutation.isPending
            ? t('dashboard.contact.saving')
            : t('dashboard.contact.save')}
        </button>

        {justSaved && (
          <span className="save-success">
            ✓ {t('dashboard.contact.saved')}
          </span>
        )}

        {isDirty && (
          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
          >
            {t('dashboard.contact.reset')}
          </button>
        )}
      </div>
    </section>
  )
}
