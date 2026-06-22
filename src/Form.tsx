import { useState } from 'react';
import { ui, INTEREST_TOPICS } from './i18n';
import type { Lang } from './i18n';
import { submitInterest } from './api/submitInterest';

export default function InterestForm() {
  const [lang, setLang] = useState<Lang>('fr');
  const t = ui[lang];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [expertise, setExpertise] = useState('');
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [interestOther, setInterestOther] = useState('');
  const [consentMailing, setConsentMailing] = useState(false);
  const [consentExpert, setConsentExpert] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function toggleInterest(slug: string) {
    setInterests(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
        if (slug === 'other') setInterestOther('');
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitInterest({
        name: name.trim(),
        email: email.trim(),
        organization: organization.trim() || undefined,
        expertise: expertise.trim() || undefined,
        interests: Array.from(interests),
        interest_other: interests.has('other') ? interestOther.trim() || undefined : undefined,
        consent_mailing: consentMailing,
        consent_expert: consentExpert,
      });
      setSubmitted(true);
    } catch (err) {
      setError(t.errorMsg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="form-card">
        <div className="thank-you">
          <h2>{t.successTitle}</h2>
          <p>{t.successText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      {/* Header */}
      <div className="form-header">
        <img src={`${import.meta.env.BASE_URL}logo-primary.svg`} alt="Lightcone Research" className="form-logo" />
        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === 'fr' ? 'active' : ''}
            onClick={() => setLang('fr')}
            aria-pressed={lang === 'fr'}
          >
            FR
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
        </div>
      </div>

      <h1 className="form-title">{t.title}</h1>
      <p className="form-intro">{t.intro}</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* ── Contact ─────────────────────────────────────────── */}
        <section className="form-section" aria-labelledby="section-contact">
          <h2 className="section-heading" id="section-contact">{t.sectionContact}</h2>

          <div className="field">
            <label htmlFor="name">
              {t.labelName}<span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              placeholder={t.placeholderName}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="email">
              {t.labelEmail}<span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t.placeholderEmail}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="organization">{t.labelOrganization}</label>
            <input
              id="organization"
              type="text"
              autoComplete="organization"
              placeholder={t.placeholderOrganization}
              value={organization}
              onChange={e => setOrganization(e.target.value)}
            />
          </div>
        </section>

        {/* ── Expertise ───────────────────────────────────────── */}
        <section className="form-section" aria-labelledby="section-expertise">
          <h2 className="section-heading" id="section-expertise">{t.sectionExpertise}</h2>

          <div className="field">
            <label htmlFor="expertise">{t.labelExpertise}</label>
            <textarea
              id="expertise"
              placeholder={t.placeholderExpertise}
              value={expertise}
              onChange={e => setExpertise(e.target.value)}
            />
          </div>
        </section>

        {/* ── Interests ───────────────────────────────────────── */}
        <section className="form-section" aria-labelledby="section-interests">
          <h2 className="section-heading" id="section-interests">{t.sectionInterests}</h2>

          <div className="field">
            <div className="checkbox-list" role="group" aria-label={t.labelInterests}>
              {INTEREST_TOPICS.map(topic => (
                <div key={topic.slug}>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={interests.has(topic.slug)}
                      onChange={() => toggleInterest(topic.slug)}
                    />
                    <span>{topic[lang]}</span>
                  </label>
                  {topic.slug === 'other' && interests.has('other') && (
                    <div className="other-input">
                      <input
                        type="text"
                        placeholder={t.placeholderOther}
                        value={interestOther}
                        onChange={e => setInterestOther(e.target.value)}
                        aria-label={t.placeholderOther}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Consent ─────────────────────────────────────────── */}
        <section className="form-section" aria-labelledby="section-consent">
          <h2 className="section-heading" id="section-consent">{t.sectionConsent}</h2>

          <div className="field">
            <div className="checkbox-list">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={consentMailing}
                  onChange={e => setConsentMailing(e.target.checked)}
                />
                <span>{t.labelConsentMailing}</span>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={consentExpert}
                  onChange={e => setConsentExpert(e.target.checked)}
                />
                <span>{t.labelConsentExpert}</span>
              </label>
            </div>
          </div>
        </section>

        {/* ── Submit ──────────────────────────────────────────── */}
        <div className="submit-area">
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? t.submitting : t.submit}
          </button>
          {error && <p className="error-msg" role="alert">{error}</p>}
        </div>

        {/* ── GDPR ────────────────────────────────────────────── */}
        <div
          className="gdpr-notice"
          dangerouslySetInnerHTML={{ __html: t.gdpr }}
        />
      </form>
    </div>
  );
}
