// pages/api/withdraw-bid.ts
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

    const { bidId } = req.body;

    // Make sure the bid belongs to this contractor
    const { data: bid, error: fetchError } = await supabase
      .from('bids')
      .select('*')
      .eq('id', bidId)
      .single();

    if (fetchError) throw fetchError;
    if (!bid || bid.contractor_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: Cannot delete this bid' });
    }

    // Don't allow withdrawal if the bid was accepted
    if (bid.accepted) {
      return res.status(400).json({ error: 'Cannot withdraw an accepted bid' });
    }

    const { error: deleteError } = await supabase
      .from('bids')
      .delete()
      .eq('id', bidId);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: '