# Design — Lightcone Research Interest Form

**Date:** 2026-06-19  
**Status:** Approved — ready for implementation

---

## 1. Overview

A bilingual (FR/EN) single-page interest form deployed as a static site on GitHub Pages. Visitors reach it via a QR code on Lightcone Research slides. Submissions are stored in Supabase (PostgreSQL) and used to build a contact network, identify working groups, and organise meetups.

```
User (QR code → browser)
        │ HTTPS
        ▼
GitHub Pages (static bundle)
  React 19 + TypeScript + Vite
  Single-page interest form, bilingual FR/EN
        │ POST JSON (anon key)
        ▼
Supabase REST API (RLS)
  → interest_submissions table (PostgreSQL)
```

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Same as `llm-survey-2026` |
| Hosting | GitHub Pages | Via GitHub Actions |
| Backend | Supabase REST API | Anon key + Row Level Security |
| Database | Supabase PostgreSQL | Managed, free tier |
| Styling | Lightcone Research brand tokens | Copied from `lightcone-website/css/tokens.css` |
| i18n | Custom `i18n.ts` | Same pattern as `llm-survey-2026` |

### CI/CD (GitHub Actions)

Two secrets required in the repository settings:

| Secret | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key |

Pipeline: `npm ci` → `npm run build` → deploy `dist/` to GitHub Pages via `actions/deploy-pages`.

---

## 3. Source Structure

```
src/
  main.tsx              — entry point, mounts <InterestForm />
  i18n.ts               — all FR/EN strings (labels, placeholders, errors, GDPR notice)
  Form.tsx              — single-page form UI + state management
  api/submitInterest.ts — type definitions + Supabase REST POST
public/
  (static assets, Lightcone logo)
```

---

## 4. Form Fields

### 4.1 Contact (required fields marked *)

| Field | Type | Required |
|---|---|---|
| Name / Nom | text input | Yes |
| Email | email input | Yes |
| Organisation | text input | No |

### 4.2 Expertise

| Field | Type | Required |
|---|---|---|
| Expertise domain / Domaine d'expertise | textarea (free text) | No |

### 4.3 Interest Topics (curated checkboxes)

> **These options are intentionally listed here so they can be edited before implementation.**

| Slug | FR label | EN label |
|---|---|---|
| `hpc` | Connexion aux supercalculateurs (HPC) | HPC cluster connectivity |
| `workflows` | Orchestration de workflows | Workflow orchestration |
| `data-portability` | Portabilité des données entre centres | Data portability across compute centres |
| `llm-inference` | Inférence de LLMs | LLM inference |
| `open-source` | Logiciels open source pour la recherche | Open-source research software |
| `reproducibility` | Reproductibilité & packaging (spec ASTRA) | Reproducibility & packaging (ASTRA spec) |
| `other` | Autre | Other |

The "Autre / Other" option reveals a free text input when ticked.

### 4.4 Consent (two independent checkboxes)

| Field | FR label | EN label |
|---|---|---|
| Mailing list | S'inscrire à la liste de diffusion Lightcone Research | Subscribe to the Lightcone Research mailing list |
| Expert contact | J'accepte d'être sollicité·e en tant qu'expert·e | I'm open to being contacted as a subject-matter expert |

---

## 5. Data Model

```sql
CREATE TABLE interest_submissions (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Contact
  name             TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  organization     TEXT,

  -- Expertise & interests
  expertise        TEXT,
  interests        TEXT[],          -- array of selected slugs e.g. ["hpc", "workflows"]
  interest_other   TEXT,            -- free text when "other" is ticked

  -- Consent
  consent_mailing  BOOLEAN     DEFAULT false NOT NULL,
  consent_expert   BOOLEAN     DEFAULT false NOT NULL
);

-- RLS: anonymous inserts only; authenticated users can read
ALTER TABLE interest_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anon"
  ON interest_submissions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "select_admins"
  ON interest_submissions FOR SELECT TO authenticated USING (true);
```

Querying by interest topic: `WHERE 'llm-inference' = ANY(interests)`.

---

## 6. Form UI Layout

Single page, Lightcone brand (parchment background, Quattrocento headings, Newsreader body, antique-gold accents). Language toggle (FR | EN) in the top-right corner.

```
┌─────────────────────────────────────────┐
│  [FR | EN]                              │
│                                         │
│  Lightcone Research logo                │
│  "Formulaire d'intérêt / Interest form" │
│  short editorial intro (1–2 sentences)  │
│                                         │
│  ── Contact ─────────────────────────── │
│  Nom / Name *          [____________]   │
│  Email *               [____________]   │
│  Organisation          [____________]   │
│                                         │
│  ── Expertise ───────────────────────── │
│  Domaine d'expertise   [____________]   │
│                                         │
│  ── Sujets d'intérêt ────────────────── │
│  ☐ Connexion HPC                        │
│  ☐ Orchestration de workflows           │
│  ☐ Portabilité des données              │
│  ☐ Inférence de LLMs                   │
│  ☐ Logiciels open source               │
│  ☐ Reproductibilité & packaging (ASTRA) │
│  ☐ Autre : [______________________]    │
│                                         │
│  ── Consentement ────────────────────── │
│  ☐ S'inscrire à la liste de diffusion   │
│  ☐ Accepter d'être sollicité·e          │
│    en tant qu'expert·e                  │
│                                         │
│  [      Envoyer / Submit      ]         │
│                                         │
│  ── RGPD / GDPR ─────────────────────── │
│  Vos données sont collectées par        │
│  Lightcone Research dans le but de      │
│  construire un réseau de contacts et    │
│  d'organiser des rencontres. Elles ne   │
│  sont pas partagées avec des tiers.     │
│  Conformément au RGPD, vous pouvez      │
│  demander leur suppression à tout       │
│  moment : info@lightconeresearch.org │
└─────────────────────────────────────────┘
```

### Behaviour

- `name` and `email` are required; all other fields are optional
- "Autre / Other" text input only appears when the "Autre / Other" checkbox is ticked
- Submit button is disabled while the request is in flight
- On success: form replaced by a thank-you message (in the active language)
- On error: inline error message below the button; form remains editable

---

## 7. GDPR Notice

Displayed below the submit button in both languages.

**FR:** *Les données collectées (nom, email, organisation, domaines d'intérêt) sont utilisées par Lightcone Research pour constituer un réseau de contacts et organiser des rencontres. Elles ne sont pas partagées avec des tiers. Conformément au RGPD, vous pouvez demander leur suppression à tout moment en écrivant à info@lightconeresearch.org.*

**EN:** *The data collected (name, email, organisation, areas of interest) is used by Lightcone Research to build a contact network and organise events. It is not shared with third parties. Under GDPR, you may request deletion at any time by writing to info@lightconeresearch.org.*

---

## 8. Out of Scope

- Email confirmation / double opt-in for the mailing list
- Rate limiting / CAPTCHA (revisit if spam becomes an issue)
- Admin dashboard (use Supabase Table Editor or SQL queries)
- Automated CSV export (use Supabase Dashboard export or `psql`)
