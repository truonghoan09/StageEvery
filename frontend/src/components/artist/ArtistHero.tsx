import './ArtistHero.scss';
import { Artist } from '../../types/artist';
import { useEffect, useRef } from 'react';

interface ArtistHeroProps {
  artist: Artist;
  tagline?: string;
}


export default function ArtistHero({ artist, tagline }: ArtistHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const onScroll = () => {
      const scrollY = window.scrollY
      const start = el.offsetTop
      const end = start + el.offsetHeight

      const progress = Math.min(
        Math.max((scrollY - start) / (end - start), 0),
        1
      )

      el.style.setProperty('--hero-overlay-opacity', String(progress))
    }


    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="artist-hero" ref={heroRef}>
      <div className="artist-hero__banner">
        {artist.coverUrl && (
          <img
            src={artist.coverUrl}
            alt={`${artist.name} cover`}
            loading="lazy"
          />
        )}
        <div className="artist-hero__overlay" />
      </div>

      <div className="artist-hero__content">
        {artist.avatarUrl && (
          <div className="artist-hero__avatar-wrap">
            <img
              src={artist.avatarUrl}
              alt={artist.name}
              loading="lazy"
            />
          </div>
        )}

        <div className="artist-hero__info">
          <h1>{artist.name}</h1>

          {tagline && (
            <p className="artist-hero__tagline">
              {tagline}
            </p>
          )}

          {artist.genres && (
            <ul className="artist-hero__genres">
              {artist.genres.slice(0, 5).map(g => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          )}

          {artist.location && (
            <p className="artist-hero__location">
              📍 {artist.location}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}



// | Field       | Min size     | Ratio |
// | ----------- | ------------ | ----- |
// | `coverUrl`  | **1600×900** | 16:9  |
// | `avatarUrl` | **400×400**  | 1:1   |



// | Field     | Max                    |
// | --------- | ---------------------- |
// | `name`    | 60 chars               |
// | `tagline` | **120 chars (2 dòng)** |
// | `genres`  | max 5                  |
