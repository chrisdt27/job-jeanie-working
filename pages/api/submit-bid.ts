// pages/api/submit-bid.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { job_id, bid_amount, is_hourly, message } = req.body;

  const { error } = await supabase.from('bids').insert({
    job_id,
    contractor_id: userId,
    bid_amount,
    is_hourly,
    message,
  });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ message: 'Bid submitted successfully' });
}
