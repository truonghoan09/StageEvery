import { useTranslation } from 'react-i18next';
import ArtistPublicPage from '../../pages/ArtistPublicPage';
import './PreviewSection.scss';

export default function PreviewSection() {
  const { t } = useTranslation();
  const ARTIST_SLUG = 'mer'; // sau này lấy từ auth / context

  const publicUrl = `/artist/${ARTIST_SLUG}`;

  return (
    <div className="dashboard-preview">
      <div className="preview-note">
        <span>{t('dashboard.preview.note')}</span>

        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="preview-open-btn"
        >
          {t('dashboard.preview.openPublic')}
        </a>
      </div>

      <div className="preview-frame">
        <ArtistPublicPage previewSlug={ARTIST_SLUG} />
      </div>
    </div>
  );
}
