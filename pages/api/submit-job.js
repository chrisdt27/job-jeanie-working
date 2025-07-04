// pages/api/submit-job.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, description, location, date, budget, urgency } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert([
      {
        user_id: userId,
        title,
        description,
        location,
        date,
        budget,
        urgency,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('❌ Supabase insert error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Job submitted successfully', job: data });
}

