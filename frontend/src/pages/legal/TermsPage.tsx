import { useTranslation } from 'react-i18next'
import './legal.scss'

export default function TermsPage() {
  const { t } = useTranslation()

  return (
    <div className="legal-page">
      <h1>{t('legal.terms.title')}</h1>

      <p className="legal-meta">
        {t('legal.terms.meta')}
      </p>

      {t('legal.terms.disclaimer') && (
        <p className="legal-disclaimer">
          {t('legal.terms.disclaimer')}
        </p>
      )}

      <section>
        <h2>{t('legal.terms.sections.about.title')}</h2>
        <p>{t('legal.terms.sections.about.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.eligibility.title')}</h2>
        <p>{t('legal.terms.sections.eligibility.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.account.title')}</h2>
        <p>{t('legal.terms.sections.account.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.content.title')}</h2>
        <p>{t('legal.terms.sections.content.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.use.title')}</h2>
        <p>{t('legal.terms.sections.use.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.pricing.title')}</h2>
        <p>{t('legal.terms.sections.pricing.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.termination.title')}</h2>
        <p>{t('legal.terms.sections.termination.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.disclaimer.title')}</h2>
        <p>{t('legal.terms.sections.disclaimer.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.liability.title')}</h2>
        <p>{t('legal.terms.sections.liability.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.changes.title')}</h2>
        <p>{t('legal.terms.sections.changes.content')}</p>
      </section>

      <section>
        <h2>{t('legal.terms.sections.contact.title')}</h2>
        <p>{t('legal.terms.sections.contact.content')}</p>
      </section>
    </div>
  )
}
