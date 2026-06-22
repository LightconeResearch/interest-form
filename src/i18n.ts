export type Lang = 'fr' | 'en';

export interface InterestTopic {
  slug: string;
  fr: string;
  en: string;
}

export const INTEREST_TOPICS: InterestTopic[] = [
  { slug: 'hpc',              fr: 'Connexion aux supercalculateurs (HPC)',            en: 'HPC cluster connectivity' },
  { slug: 'workflows',        fr: 'Orchestration de workflows',                       en: 'Workflow orchestration' },
  { slug: 'data-portability', fr: 'Portabilité des données entre centres de calcul',  en: 'Data portability across compute centres' },
  { slug: 'llm-inference',    fr: 'Inférence de LLMs',                               en: 'LLM inference' },
  { slug: 'open-source',      fr: 'Logiciels open source pour la recherche',          en: 'Open-source research software' },
  { slug: 'reproducibility',  fr: 'Reproductibilité & packaging (spec ASTRA)',        en: 'Reproducibility & packaging (ASTRA spec)' },
  { slug: 'other',            fr: 'Autre',                                            en: 'Other' },
];

interface UiStrings {
  title: string;
  intro: string;
  sectionContact: string;
  sectionExpertise: string;
  sectionInterests: string;
  sectionConsent: string;
  labelName: string;
  labelEmail: string;
  labelOrganization: string;
  labelExpertise: string;
  labelInterests: string;
  labelConsentMailing: string;
  labelConsentExpert: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderOrganization: string;
  placeholderExpertise: string;
  placeholderOther: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successText: string;
  errorMsg: string;
  gdpr: string;
}

export const ui: Record<Lang, UiStrings> = {
  fr: {
    title: 'Formulaire d\'intérêt',
    intro: 'Lightcone Research cherche à constituer un réseau d\'experts et à identifier des groupes de travail autour des enjeux de calcul scientifique. Remplissez ce formulaire pour rester en contact et contribuer à nos rencontres.',
    sectionContact: 'Contact',
    sectionExpertise: 'Expertise',
    sectionInterests: 'Sujets d\'intérêt',
    sectionConsent: 'Consentement',
    labelName: 'Nom',
    labelEmail: 'Email',
    labelOrganization: 'Organisation',
    labelExpertise: 'Domaine d\'expertise',
    labelInterests: 'Cochez les sujets qui vous intéressent',
    labelConsentMailing: 'S\'inscrire à la liste de diffusion Lightcone Research',
    labelConsentExpert: 'J\'accepte d\'être sollicité·e en tant qu\'expert·e',
    placeholderName: 'Votre nom',
    placeholderEmail: 'votre@email.org',
    placeholderOrganization: 'Université, laboratoire…',
    placeholderExpertise: 'Décrivez brièvement votre domaine (facultatif)',
    placeholderOther: 'Précisez…',
    submit: 'Envoyer',
    submitting: 'Envoi en cours…',
    successTitle: 'Merci !',
    successText: 'Votre réponse a bien été enregistrée.',
    errorMsg: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou écrire à info@lightconeresearch.org si le problème persiste.',
    gdpr: 'Les données collectées (nom, email, organisation, domaines d\'intérêt) sont utilisées par Lightcone Research pour constituer un réseau de contacts et organiser des rencontres. Elles ne sont pas partagées avec des tiers. Conformément au RGPD, vous pouvez demander leur suppression à tout moment en écrivant à <a href="mailto:info@lightconeresearch.org">info@lightconeresearch.org</a>.',
  },
  en: {
    title: 'Interest form',
    intro: 'Lightcone Research is building a network of experts and identifying working groups around scientific computing challenges. Fill in this form to stay in touch and contribute to our events.',
    sectionContact: 'Contact',
    sectionExpertise: 'Expertise',
    sectionInterests: 'Topics of interest',
    sectionConsent: 'Consent',
    labelName: 'Name',
    labelEmail: 'Email',
    labelOrganization: 'Organisation',
    labelExpertise: 'Expertise domain',
    labelInterests: 'Check the topics that interest you',
    labelConsentMailing: 'Subscribe to the Lightcone Research mailing list',
    labelConsentExpert: 'I\'m open to being contacted as a subject-matter expert',
    placeholderName: 'Your name',
    placeholderEmail: 'your@email.org',
    placeholderOrganization: 'University, Lab…',
    placeholderExpertise: 'Briefly describe your domain (optional)',
    placeholderOther: 'Please specify…',
    submit: 'Submit',
    submitting: 'Submitting…',
    successTitle: 'Thank you!',
    successText: 'Your response has been recorded.',
    errorMsg: 'An error occurred while submitting. Please try again or write to info@lightconeresearch.org if the problem persists.',
    gdpr: 'The data collected (name, email, organisation, areas of interest) is used by Lightcone Research to build a contact network and organise events. It is not shared with third parties. Under GDPR, you may request deletion at any time by writing to <a href="mailto:info@lightconeresearch.org">info@lightconeresearch.org</a>.',
  },
};
