// pages/api/generate-job.ts

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: 'No idea provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Jeanie, a helpful assistant that creates clear, structured job postings based on user ideas. Return JSON with title and description only, no commentary.',
        },
        {
          role: 'user',
          content: `User's job idea: ${idea}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const message = completion.choices[0].message.content;
    const json = JSON.parse(message || '{}');

    return res.status(200).json(json);
  } catch (error) {
    console.error('OpenAI error:', error);
    return res.status(500).json({ error: 'Error generating job with Jeanie AI.' });
  }
}
