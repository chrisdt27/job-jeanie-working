// pages/api/accept-bid.ts

import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { bidId, jobId } = req.body;

    if (!bidId || !jobId) {
      return res.status(400).json({ error: 'Missing bidId or jobId' });
    }

    // Step 1: Verify the job belongs to this user
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;
    if (!job || job.user_id !== userId) {
      return res.status(403).json({ error: 'You do not own this job posting' });
    }

    // Step 2: Accept the selected bid
    const { error: acceptError } = await supabase
      .from('bids')
      .update({ accepted: true })
      .eq('id', bidId);

    if (acceptError) throw acceptError;

    // Step 3: Reject all other bids for this job
    const { error: rejectError } = await supabase
      .from('bids')
      .update({ accepted: false })
      .eq('job_id', jobId)
      .neq('id', bidId);

    if (rejectError) throw rejectError;

    // Step 4: Update job status to in_progress
    const { error: jobStatusError } = await supabase
      .from('jobs')
      .update({ status: 'in_progress' })
      .eq('id', jobId);

    if (jobStatusError) throw jobStatusError;

    res.status(200).json({ message: 'Bid accepted and job marked as in progress successfully' });
  } catch (err: any) {
    console.error('❌ Accept bid error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

