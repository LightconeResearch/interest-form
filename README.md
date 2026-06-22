# Lightcone Research — Interest Form

Bilingual (FR/EN) single-page interest form, deployed on GitHub Pages with Supabase as backend.

## Local development

```bash
make install   # install dependencies
make dev       # start dev server at http://localhost:5173
make build     # production build → dist/
make preview   # serve dist/ locally
make clean     # remove dist/ and node_modules/
```

---

## Setup guide

### 1. Create the Supabase table

1. Go to [supabase.com](https://supabase.com), create a project (free tier is fine).
2. Open **SQL Editor** and run:

```sql
CREATE TABLE interest_submissions (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name             TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  organization     TEXT,
  expertise        TEXT,
  interests        TEXT[],
  interest_other   TEXT,
  consent_mailing  BOOLEAN     DEFAULT false NOT NULL,
  consent_expert   BOOLEAN     DEFAULT false NOT NULL
);

ALTER TABLE interest_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anon"
  ON interest_submissions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "select_admins"
  ON interest_submissions FOR SELECT TO authenticated USING (true);

GRANT INSERT ON public.interest_submissions TO anon;
```

3. Retrieve your credentials from **Project Settings → API**:
   - **Project URL** (`https://xxxx.supabase.co`)
   - **anon / public** key

### 2. Create the GitHub repository

```bash
gh repo create lightcone-research/interest-form --public
git remote add origin git@github.com:lightcone-research/interest-form.git
git push -u origin main
```

### 3. Add secrets to GitHub

In the repository go to **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Project URL from step 1 |
| `VITE_SUPABASE_ANON_KEY` | anon/public key from step 1 |

### 4. Enable GitHub Pages

In the repository go to **Settings → Pages** and set:
- **Source**: GitHub Actions

The next push to `main` triggers the workflow and publishes the form. The URL will be `https://lightcone-research.github.io/interest-form/`.

---

## Querying submissions

Use the Supabase **Table Editor** or connect via `psql`:

```sql
-- All submissions
SELECT * FROM interest_submissions ORDER BY submitted_at DESC;

-- Filter by interest topic
SELECT name, email, organization
FROM interest_submissions
WHERE 'llm-inference' = ANY(interests);

-- Mailing list subscribers
SELECT name, email FROM interest_submissions WHERE consent_mailing = true;
```
