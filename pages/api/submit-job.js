export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, location, date, budget, urgency } = req.body;

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'return=representation'
    },
    body: JSON.stringify({ title, description, location, date, budget, urgency })
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to submit job', details: data });
  }

  res.status(200).json({ message: 'Job submitted successfully', job: data });
}
