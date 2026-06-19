const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface InterestFormData {
  name: string;
  email: string;
  organization?: string;
  expertise?: string;
  interests: string[];
  interest_other?: string;
  consent_mailing: boolean;
  consent_expert: boolean;
}

export async function submitInterest(data: InterestFormData): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  const payload = {
    name:             data.name,
    email:            data.email,
    organization:     data.organization || null,
    expertise:        data.expertise || null,
    interests:        data.interests.length > 0 ? data.interests : null,
    interest_other:   data.interest_other || null,
    consent_mailing:  data.consent_mailing,
    consent_expert:   data.consent_expert,
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/interest_submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Submit failed (HTTP ${response.status}): ${errorText}`);
  }
}
