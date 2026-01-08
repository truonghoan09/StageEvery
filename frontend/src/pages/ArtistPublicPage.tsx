import './ArtistPublicPage.scss';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import { Artist, ArtistTheme } from '../types/artist';
import { getArtistBySlug } from '../services/artist.service';

import ArtistHero from '../components/artist/ArtistHero';
import ArtistBio from '../components/artist/ArtistBio';
import ArtistMusic from '../components/artist/ArtistMusic';
import ArtistContact from '../components/artist/ArtistContact';
import ArtistPublicSkeleton from '../components/artist/ArtistPublicSkeleton';
import { useEffect, useState } from 'react';

interface ArtistPublicPageProps {
  previewSlug?: string;
}

export default function ArtistPublicPage({ previewSlug }: ArtistPublicPageProps) {
  const isPreview = new URLSearchParams(window.location.search).has('preview')
  const [previewTheme, setPreviewTheme] = useState<ArtistTheme | null>(null)
  const params = useParams();
  const slug = previewSlug || params.slug;
  const { t, i18n } = useTranslation();


  useEffect(() => {
    if (!isPreview) return
  
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'PREVIEW_THEME') return
      setPreviewTheme(event.data.tokens)
    }
  
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [isPreview])

  useEffect(() => {
    if (!isPreview) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Chặn link
      if (target.closest('a')) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // Chặn button
      if (target.closest('button')) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [isPreview])


  useEffect(() => {
    if (!isPreview) return

    const handleMediaPlay = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      const media = e.target as HTMLMediaElement
      media.pause()
    }

    document.addEventListener('play', handleMediaPlay, true)

    return () => {
      document.removeEventListener('play', handleMediaPlay, true)
    }
  }, [isPreview])

  useEffect(() => {
    if (!isPreview) return

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('input, textarea, select')) {
        target.blur()
      }
    }

    document.addEventListener('focusin', handleFocus)

    return () => {
      document.removeEventListener('focusin', handleFocus)
    }
  }, [isPreview])


  if (!slug) return null;


  const {
    data: artist,
    isLoading,
    isError,
  } = useQuery<Artist>({
    queryKey: ['artist', slug],
    queryFn: () => getArtistBySlug(slug!),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });


  // ======================
  // States
  // ======================
  if (isLoading) {
    return <ArtistPublicSkeleton />;
  }

  if (isError || !artist) {
    return <p>{t('artist.states.notFound')}</p>;
  }

  const lang = i18n.language as 'vi' | 'en';

  // ======================
  // Localized content
  // ======================
  const bioByLang = artist.bio
    ? {
        short:
          artist.bio.short?.[lang] ||
          artist.bio.short?.vi ||
          artist.bio.short?.en,

        full:
          artist.bio.full?.[lang] ||
          artist.bio.full?.vi ||
          artist.bio.full?.en,

        highlights:
          artist.bio.highlights?.[lang] ||
          artist.bio.highlights?.vi ||
          artist.bio.highlights?.en,
      }
    : null;

  const taglineByLang =
    artist.tagline?.[lang] ||
    artist.tagline?.vi ||
    artist.tagline?.en ||
    '';

  // ======================
  // SEO
  // ======================
  const description =
    bioByLang?.short?.slice(0, 150) ||
    t('artist.page.descriptionFallback', { name: artist.name });

  const canonicalUrl = `https://stageevery.app/artist/${artist.slug}`;

  const seoImage =
    artist.coverUrl ||
    artist.avatarUrl;


  const themeTokens = isPreview
  ? previewTheme ?? artist.theme?.tokens
  : artist.theme?.tokens


  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>{t('artist.page.title', { name: artist.name })}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={artist.name} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        {seoImage && (
          <meta property="og:image" content={seoImage} />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={artist.name} />
        <meta name="twitter:description" content={description} />
        {seoImage && (
          <meta name="twitter:image" content={seoImage} />
        )}
      </Helmet>

      <main
        className={`artist-public-page ${isPreview ? 'is-preview' : ''}`}
        style={
          themeTokens
            ? ({
                '--artist-bg': themeTokens.bg,
                '--artist-bg-soft': themeTokens.bgSoft,
                '--artist-text': themeTokens.text,
                '--artist-text-soft': themeTokens.textSoft,
                '--artist-text-muted': themeTokens.textMuted,
                '--artist-primary': themeTokens.primary,
              } as React.CSSProperties)
            : undefined
        }
      >
        <ArtistHero artist={artist} tagline={taglineByLang} />

        {bioByLang && (
          <ArtistBio
            title={t('artist.sections.about')}
            bio={bioByLang}
          />
        )}

        <ArtistMusic
          artist={artist}
          title={t('artist.sections.music')}
          listenLabel={t('artist.actions.listen')}
        />

        <ArtistContact
          artist={artist}
          title={t('artist.sections.contact')}
        />
      </main>
    </>
  );
}
