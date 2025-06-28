import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, description, location, budget, isUrgent } = req.body;

  try {
    const { data, error } = await supabase.from('jobs').insert([
      {
        title,
        description,
        location,
        budget,
        is_urgent: isUrgent,
        user_id: userId,
      },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Job posted successfully', data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
