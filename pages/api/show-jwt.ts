// pages/api/show-jwt.ts
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authData = getAuth(req);
    console.log('🔍 Decoded Clerk Auth Data:', authData);

    if (!authData || !authData.userId) {
      return res.status(401).json({ error: 'Unauthorized - no valid Clerk session', authData });
    }

    return res.status(200).json({ message: '✅ JWT info retrieved', authData });
  } catch (err: any) {
    console.error('❌ Error in show-jwt:', err.message || err);
    return res.status(500).json({ error: err.message || 'Unexpected error' });
  }
}
