// pages/api/fetch-job-by-id.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { job_id } = req.query;

  if (!job_id) {
    return res.status(400).json({ error: 'Missing job_id parameter' });
  }

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', job_id)
      .single();

    if (error || !data) {
      console.error('Supabase error:', error);
      return res.status(404).json({ error: 'Job not found' });
    }

    if (data.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
