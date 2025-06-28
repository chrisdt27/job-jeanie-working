import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - Clerk user ID not found' });
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .limit(1);

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Supabase error:', error.message || error);
    res.status(500).json({ error: error.message || 'Unexpected error' });
  }
}
