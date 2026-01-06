// frontend/src/components/artist/ArtistBio.tsx

import './ArtistBio.scss';
import { useState } from 'react';

interface BioContent {
  short?: string;
  full?: string;
  highlights?: string[];
}

interface Props {
  title: string;
  bio: BioContent;
}

export default function ArtistBio({ title, bio }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!bio?.short && !bio?.full) return null;

  const hasFull = Boolean(bio.full);
  const hasHighlights = Boolean(bio.highlights?.length);

  return (
    <section className="artist-bio">
      <h2>{title}</h2>

      {/* Short bio – always visible */}
      {bio.short && (
        <p className="artist-bio__short">
          {bio.short}
        </p>
      )}

      {/* Highlights */}
      {hasHighlights && (
        <ul className="artist-bio__highlights">
          {bio.highlights!.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {/* Full bio – expandable */}
      {hasFull && expanded && (
        <p className="artist-bio__full">
          {bio.full}
        </p>
      )}

      {/* Toggle */}
      {hasFull && (
        <button
          className="artist-bio__toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </section>
  );
}
