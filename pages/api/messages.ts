// pages/api/messages.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';

// Initialize Supabase client with your environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the logged-in user's Clerk userId
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { method } = req;

  if (method === 'GET') {
    const { job_id } = req.query;

    // Fetch messages for a specific job_id
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('job_id', job_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Fetch error:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  if (method === 'POST') {
    const { job_id, recipient_id, message } = req.body;

    // Basic validation to ensure all required fields are present
    if (!job_id || !recipient_id || !message) {
      console.error('Missing fields:', { job_id, recipient_id, message });
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Log data for debugging to confirm what is being inserted
    console.log('Inserting message:', {
      job_id,
      recipient_id,
      sender_id: userId,
      message,
    });

    // Insert the message into Supabase
    const { data, error } = await supabase.from('messages').insert([
      {
        job_id,
        recipient_id,
        sender_id: userId,
        message,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    return res.status(200).json({ message: 'Message sent successfully', data });
  }

  // Handle unsupported HTTP methods
  return res.status(405).json({ error: 'Method not allowed' });
}
