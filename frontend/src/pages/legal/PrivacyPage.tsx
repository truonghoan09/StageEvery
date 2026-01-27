import { useTranslation } from 'react-i18next'
import './legal.scss'

export default function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <div className="legal-page">
      <h1>{t('legal.privacy.title')}</h1>

      <p className="legal-meta">
        {t('legal.privacy.meta')}
      </p>

      {t('legal.privacy.disclaimer') && (
        <p className="legal-disclaimer">
          {t('legal.privacy.disclaimer')}
        </p>
      )}

      <section>
        <h2>{t('legal.privacy.sections.collect.title')}</h2>
        <p>{t('legal.privacy.sections.collect.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.use.title')}</h2>
        <p>{t('legal.privacy.sections.use.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.auth.title')}</h2>
        <p>{t('legal.privacy.sections.auth.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.sharing.title')}</h2>
        <p>{t('legal.privacy.sections.sharing.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.retention.title')}</h2>
        <p>{t('legal.privacy.sections.retention.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.security.title')}</h2>
        <p>{t('legal.privacy.sections.security.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.children.title')}</h2>
        <p>{t('legal.privacy.sections.children.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.rights.title')}</h2>
        <p>{t('legal.privacy.sections.rights.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.changes.title')}</h2>
        <p>{t('legal.privacy.sections.changes.content')}</p>
      </section>

      <section>
        <h2>{t('legal.privacy.sections.contact.title')}</h2>
        <p>{t('legal.privacy.sections.contact.content')}</p>
      </section>
    </div>
  )
}
