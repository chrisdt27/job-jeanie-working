// pages/api/fetch-messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const jobId = req.query.jobId as string;
  if (!jobId) {
    return res.status(400).json({ error: 'Missing jobId' });
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('job_id', jobId)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    return res.status(500).json({ error: 'Error fetching messages' });
  }

  return res.status(200).json(data);
}

