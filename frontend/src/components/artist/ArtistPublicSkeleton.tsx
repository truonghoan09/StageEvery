import './ArtistPublicSkeleton.scss';

export default function ArtistPublicSkeleton() {
  return (
    <div className="artist-public-skeleton">
      {/* Hero */}
      <section className="artist-hero">
        <div className="artist-hero__banner skeleton" />

        <div className="artist-hero__content">
          <div className="artist-hero__avatar-wrap skeleton" />

          <div className="artist-hero__info">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="artist-bio">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </section>

      {/* Music */}
      <section className="artist-music">
        <div className="skeleton skeleton-track" />
        <div className="skeleton skeleton-track" />
        <div className="skeleton skeleton-track" />
      </section>
    </div>
  );
}
