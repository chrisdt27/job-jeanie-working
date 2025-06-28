// pages/api/debug-auth.ts
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authData = getAuth(req);
    const authHeader = req.headers['authorization'];

    console.log('🔍 Auth Debug Info:', authData);
    console.log('🪪 Authorization Header:', authHeader);

    if (!authData || !authData.userId) {
      return res.status(401).json({
        error: 'Unauthorized - no userId found',
        authData,
        authHeader,
      });
    }

    return res.status(200).json({
      message: '✅ User is authenticated',
      userId: authData.userId,
      authData,
      authHeader,
    });
  } catch (err: any) {
    console.error('❌ Auth check error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
