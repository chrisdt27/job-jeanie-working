// pages/api/send-message.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId } = getAuth(req);

  if (!userId) {
    console.error('❌ No user ID found in token');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { job_id, recipient_id, message } = req.body;

  if (!job_id || !recipient_id || !message) {
    console.error('❌ Missing required fields:', { job_id, recipient_id, message });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { error } = await supabase.from('messages').insert([
    {
      job_id,
      sender_id: userId, // ✅ set from token
      recipient_id,
      message,
    },
  ]);

  if (error) {
    console.error('❌ Supabase insert error:', error);
    return res.status(500).json({ error: 'Database insert failed' });
  }

  console.log('✅ Message inserted');
  res.status(200).json({ success: true });
}
