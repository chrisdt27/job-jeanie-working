// pages/api/edit-job.ts
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

  const { id, title, description, location } = req.body;

  if (!id || !title || !description || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { error } = await supabase
    .from('jobs')
    .update({ title, description, location })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('❌ Supabase update error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Job updated successfully' });
}
