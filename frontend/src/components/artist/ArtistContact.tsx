// frontend/src/components/artist/ArtistContact.tsx

import './ArtistContact.scss';
import { Artist } from '../../types/artist';

interface Props {
  artist: Artist;
  title: string;
}

export default function ArtistContact({ artist, title }: Props) {
  const socials = artist.socials;
  if (!socials) return null;

  return (
    <section className="artist-contact">
      <h2>{title}</h2>

      <ul className="artist-contact__list">
        {socials.facebook && (
          <li>
            <a
              href={socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </li>
        )}

        {socials.instagram && (
          <li>
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </li>
        )}

        {socials.youtube && (
          <li>
            <a
              href={socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          </li>
        )}

        {socials.spotify && (
          <li>
            <a
              href={socials.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
          </li>
        )}

        {socials.website && (
          <li>
            <a
              href={socials.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}
