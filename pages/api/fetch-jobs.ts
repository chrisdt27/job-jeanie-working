// pages/api/fetch-jobs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = getAuth(req);
    console.log('🧪 Clerk user ID:', userId);

    if (!userId) {
      console.error('🚫 No userId returned from Clerk');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('🔥 Supabase SELECT error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log(`✅ Retrieved ${data.length} job(s) for user ${userId}`);
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('🧨 Unexpected error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
