// pages/api/accept-job.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';

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

  const { job_id } = req.body;

  if (!job_id) {
    return res.status(400).json({ error: 'Job ID is required' });
  }

  const { data, error } = await supabase
    .from('jobs')
    .update({
      status: 'Accepted',
      contractor_id: userId,
    })
    .eq('id', job_id)
    .select();

  if (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({ error: 'Error updating job' });
  }

  return res.status(200).json({ message: 'Job accepted successfully', job: data[0] });
}
