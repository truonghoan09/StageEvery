//frontend/src/components/artist/ArtistMusic.tsx

// frontend/src/components/artist/ArtistMusic.tsx

import './ArtistMusic.scss';
import { useRef, useState } from 'react';
import { Artist } from '../../types/artist';

interface Props {
  artist: Artist;
  title: string;
  listenLabel: string;
}

export default function ArtistMusic({ artist, title, listenLabel }: Props) {
  const tracks = artist.tracks?.slice(0, 5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  if (!tracks || tracks.length === 0) return null;

  const handlePlay = (trackId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    if (currentTrackId === trackId) {
      audioRef.current?.pause();
      setCurrentTrackId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setCurrentTrackId(trackId);
    }
  };

  const externalLink =
    artist.socials?.spotify || artist.socials?.youtube;

  return (
    <section className="artist-music">
      <h2>{title}</h2>

      <ul className="track-list">
        {tracks.map(track => (
          <li
            key={track.id}
            className={`track ${currentTrackId === track.id ? 'playing' : ''}`}
          >
            <button
              className="play-button"
              onClick={() => handlePlay(track.id, track.audioUrl)}
              disabled={!track.audioUrl}
            >
              {currentTrackId === track.id ? '❚❚' : '▶'}
            </button>

            <span className="track-title">{track.title}</span>
          </li>
        ))}
      </ul>

      {externalLink && (
        <div className="music-external">
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {listenLabel}
          </a>
        </div>
      )}

      {/* Hidden audio player */}
      <audio ref={audioRef} preload="none" />
    </section>
  );
}
