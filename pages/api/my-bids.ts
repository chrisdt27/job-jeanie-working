// pages/api/my-bids.ts
import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
      .from('bids')
      .select('*, jobs(title)')
      .eq('contractor_id', userId);

    if (error) throw error;

    // Flatten the job title into each bid
    const formatted = data.map((bid) => ({
      ...bid,
      job_title: bid.jobs?.title || 'Unknown Job',
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error('❌ Error fetching contractor bids:', err.message);
    res.status(500).json({ error: err.message });
  }
}
