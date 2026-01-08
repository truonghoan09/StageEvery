export interface Artist {
  // Core
  id: string;
  slug: string;
  name: string;

  // Visual
  avatarUrl?: string;
  coverUrl?: string;

  // Identity
  tagline?: {
    vi?: string; // max ~80 chars
    en?: string;
  };

  /**
   * Artist bio – structured for SEO & CMS
   */
  bio?: {
    /**
     * Short bio
     * - dùng cho SEO description
     * - preview / card
     * - max ~200–240 chars
     */
    short?: {
      vi?: string;
      en?: string;
    };

    /**
     * Full bio
     * - dùng cho ArtistBio (expand)
     * - max ~800–1000 chars
     */
    full?: {
      vi?: string;
      en?: string;
    };

    /**
     * Highlights / bullet points
     * - scan nhanh
     * - mỗi item max ~80–100 chars
     */
    highlights?: {
      vi?: string[];
      en?: string[];
    };
  };

  genres?: string[];
  location?: string;

  // Social / Contact
  socials?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
    website?: string;
    email?: string;
  };

  // Music
  tracks?: ArtistTrack[];

  // Optional future
  gallery?: string[];
  theme?: {
    paletteId: string;
  };
}

export interface ArtistTrack {
  id: string;
  title: string;

  /**
   * File audio để nghe trực tiếp trên web
   * - mp3 / wav
   * - tối đa 5 track / artist
   */
  audioUrl?: string;

  /**
   * Link ngoài (Spotify / SoundCloud / YouTube…)
   * Dùng cho:
   * - fallback
   * - hoặc link “nghe đầy đủ”
   */
  embedUrl?: string;

  /**
   * Ảnh cover riêng cho track (optional)
   * Nếu không có → dùng avatar / cover artist
   */
  coverUrl?: string;

  /**
   * Metadata
   */
  releaseYear?: number;
  featured?: boolean;
}

export interface ArtistTheme {
  bg?: string
  bgSoft?: string
  text?: string
  textSoft?: string
  textMuted?: string
  primary?: string
}