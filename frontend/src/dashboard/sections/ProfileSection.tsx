import './ProfileSection.scss';

import InfoIcon from '../../components/InfoIcon';

import { useEffect, useState, KeyboardEvent, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Artist } from '../../types/artist';
import {
  getArtistBySlug,
  updateArtistBySlug,
} from '../../services/artist.service';

const NAME_MAX = 60;
const TAGLINE_MAX = 100;
const BIO_SHORT_MAX = 160;
const GENRE_MAX = 5;
const LOCATION_MAX = 60;
type ContentLangMode = 'both' | 'vi' | 'en';

export default function ProfileSection() {
  const [initialData, setInitialData] = useState<any>(null);

  const [contentLangMode, setContentLangMode] =
    useState<ContentLangMode>('both');

  const [justSaved, setJustSaved] = useState(false);

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const ARTIST_SLUG = 'mer';

  const { data: artist, isLoading } = useQuery<Artist>({
    queryKey: ['artist-dashboard', ARTIST_SLUG],
    queryFn: () => getArtistBySlug(ARTIST_SLUG),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      updateArtistBySlug(ARTIST_SLUG, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artist', ARTIST_SLUG] });
      queryClient.invalidateQueries({
        queryKey: ['artist-dashboard', ARTIST_SLUG],
      });

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    },
  });


  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bioShortVi, setBioShortVi] = useState('');
  const [bioShortEn, setBioShortEn] = useState('');
  const [bioFullVi, setBioFullVi] = useState('');
  const [bioFullEn, setBioFullEn] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (!artist) return;

    const snapshot = {
      name: artist.name || '',
      tagline: artist.tagline?.vi || artist.tagline?.en || '',
      bioShortVi: artist.bio?.short?.vi || '',
      bioShortEn: artist.bio?.short?.en || '',
      bioFullVi: artist.bio?.full?.vi || '',
      bioFullEn: artist.bio?.full?.en || '',
      genres: artist.genres || [],
      location: artist.location || '',
    };

    setInitialData(snapshot);

    
    setName(artist.name || '');
    setTagline(artist.tagline?.vi || artist.tagline?.en || '');
    setBioShortVi(artist.bio?.short?.vi || '');
    setBioShortEn(artist.bio?.short?.en || '');
    setBioFullVi(artist.bio?.full?.vi || '');
    setBioFullEn(artist.bio?.full?.en || '');
    setGenres(artist.genres || []);
    setLocation(artist.location || '');

  }, [artist]);

  const isDirty = useMemo(() => {
    if (!initialData) return false;

    return (
      name !== initialData.name ||
      tagline !== initialData.tagline ||
      bioShortVi !== initialData.bioShortVi ||
      bioShortEn !== initialData.bioShortEn ||
      bioFullVi !== initialData.bioFullVi ||
      bioFullEn !== initialData.bioFullEn ||
      location !== initialData.location ||
      JSON.stringify(genres) !== JSON.stringify(initialData.genres)
    );
  }, [
    name,
    tagline,
    bioShortVi,
    bioShortEn,
    bioFullVi,
    bioFullEn,
    genres,
    location,
    initialData,
  ]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleReset = () => {
    if (!initialData) return;

    setName(initialData.name);
    setTagline(initialData.tagline);
    setBioShortVi(initialData.bioShortVi);
    setBioShortEn(initialData.bioShortEn);
    setBioFullVi(initialData.bioFullVi);
    setBioFullEn(initialData.bioFullEn);
    setGenres(initialData.genres);
    setLocation(initialData.location);
  };

  const handleAddGenre = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const value = genreInput.trim();
    if (!value || genres.includes(value) || genres.length >= GENRE_MAX) return;

    setGenres([...genres, value]);
    setGenreInput('');
  };

  if (isLoading) {
    return <p>{t('dashboard.profile.loading')}</p>;
  }

  const finalBioShort = (() => {
    if (contentLangMode === 'vi') {
      return { vi: bioShortVi, en: bioShortVi };
    }
    if (contentLangMode === 'en') {
      return { vi: bioShortEn, en: bioShortEn };
    }
    return { vi: bioShortVi, en: bioShortEn };
  })();

  const finalBioFull = (() => {
    if (contentLangMode === 'vi') {
      return { vi: bioFullVi, en: bioFullVi };
    }
    if (contentLangMode === 'en') {
      return { vi: bioFullEn, en: bioFullEn };
    }
    return { vi: bioFullVi, en: bioFullEn };
  })();

  return (
    <section className="dashboard-profile">
      <h2>{t('dashboard.profile.title')}</h2>

      {/* BASIC INFO */}
      <div className="section">
        <div className="section-title">
          {t('dashboard.profile.basicInfo')}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>
              {t('dashboard.profile.name')}
              <InfoIcon text={t('dashboard.profile.nameHint')} />
            </label>
            <input
              value={name}
              maxLength={NAME_MAX}
              onChange={e => setName(e.target.value)}
            />
            <div className="char-counter">
              {name.length} / {NAME_MAX}
            </div>
          </div>

          <div className="form-group">
            <label>
              {t('dashboard.profile.tagline')}
              <InfoIcon text={t('dashboard.profile.taglineHint')} />
            </label>
            <input
              value={tagline}
              maxLength={TAGLINE_MAX}
              onChange={e => setTagline(e.target.value)}
            />
            <div className="char-counter">
              {tagline.length} / {TAGLINE_MAX}
            </div>
          </div>

          <div className="form-group">
            <label>
              {t('dashboard.profile.location')}
              <InfoIcon text={t('dashboard.profile.locationHint')} />
            </label>
            <input
              value={location}
              maxLength={LOCATION_MAX}
              onChange={e => setLocation(e.target.value)}
            />
            <div className="char-counter">
              {location.length} / {LOCATION_MAX}
            </div>
          </div>
        </div>
      </div>

      {/* LANGUAGE MODE */}
      <div className="lang-mode">
        <label>
          <input
            type="radio"
            name="contentLangMode"
            checked={contentLangMode === 'both'}
            onChange={() => setContentLangMode('both')}
          />
          {t('dashboard.profile.bilingual')}
        </label>

        <label>
          <input
            type="radio"
            name="contentLangMode"
            checked={contentLangMode === 'vi'}
            onChange={() => setContentLangMode('vi')}
          />
          {t('dashboard.profile.onlyVi')}
        </label>

        <label>
          <input
            type="radio"
            name="contentLangMode"
            checked={contentLangMode === 'en'}
            onChange={() => setContentLangMode('en')}
          />
          {t('dashboard.profile.onlyEn')}
        </label>
      </div>

      {/* BIO SHORT */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">
            {t('dashboard.profile.bioShort')}
          </div>
          <InfoIcon text={t('dashboard.profile.bioShortHint')} />
        </div>

        <div className="form-grid">
          {(contentLangMode === 'both' || contentLangMode === 'vi') && (
            <div className="form-group">
              <label>{t('dashboard.profile.bioShortVi')}</label>
              <textarea
                value={bioShortVi}
                maxLength={BIO_SHORT_MAX}
                onChange={e => setBioShortVi(e.target.value)}
              />
              <div className="char-counter">
                {bioShortVi.length} / {BIO_SHORT_MAX}
              </div>
            </div>
          )}

          {(contentLangMode === 'both' || contentLangMode === 'en') && (
            <div className="form-group">
              <label>{t('dashboard.profile.bioShortEn')}</label>
              <textarea
                value={bioShortEn}
                maxLength={BIO_SHORT_MAX}
                onChange={e => setBioShortEn(e.target.value)}
              />
              <div className="char-counter">
                {bioShortEn.length} / {BIO_SHORT_MAX}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">
            {t('dashboard.profile.bioFull')}
          </div>
          <InfoIcon text={t('dashboard.profile.bioFullHint')} />
        </div>

        <div className="form-grid">
          {(contentLangMode === 'both' || contentLangMode === 'vi') && (
            <div className="form-group">
              <label>{t('dashboard.profile.bioShortVi')}</label>
              <textarea
                value={bioFullVi}
                onChange={e => setBioFullVi(e.target.value)}
                style={{ minHeight: 220 }}
              />
              <div className="char-counter">
                {bioFullVi.length} ·{' '}
                {t('dashboard.profile.bioFullRecommended')}
              </div>
            </div>
          )}

          {(contentLangMode === 'both' || contentLangMode === 'en') && (
            <div className="form-group">
              <label>{t('dashboard.profile.bioShortEn')}</label>
              <textarea
                value={bioFullEn}
                onChange={e => setBioFullEn(e.target.value)}
                style={{ minHeight: 220 }}
              />
              <div className="char-counter">
                {bioFullEn.length} ·{' '}
                {t('dashboard.profile.bioFullRecommended')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GENRES */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">
            {t('dashboard.profile.genres')}
          </div>
          <InfoIcon text={t('dashboard.profile.genresHint')} />
        </div>


        <input
          className="genre-input"
          value={genreInput}
          onChange={e => setGenreInput(e.target.value)}
          onKeyDown={handleAddGenre}
        />

        <div className="genre-list">
          {genres.map(g => (
            <span
              key={g}
              className="genre-chip"
              onClick={() =>
                setGenres(genres.filter(x => x !== g))
              }
            >
              {g} ×
            </span>
          ))}
        </div>
      </div>

      <div className="actions">
        <button
          onClick={() =>
            updateMutation.mutate({
              name,
              tagline: { vi: tagline },
              bio: {
                short: finalBioShort,
                full: finalBioFull,
              },
              genres,
              location,
            })
          }
          disabled={!isDirty || updateMutation.isPending}
        >
          {updateMutation.isPending
            ? t('dashboard.profile.saving')
            : t('dashboard.profile.save')}
        </button>
        {justSaved && (
          <span className="save-success">
            ✓ {t('dashboard.profile.saved')}
          </span>
        )}
        {isDirty && (
          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
          >
            {t('dashboard.profile.reset')}
          </button>
        )}
      </div>
    </section>
  );
}
