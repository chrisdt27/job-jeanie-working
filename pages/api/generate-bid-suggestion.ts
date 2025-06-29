// pages/api/generate-bid-suggestion.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { getAuth } from '@clerk/nextjs/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'Missing jobId' });
  }

  try {
    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('title, description, budget')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      console.error('Job fetch error:', jobError);
      return res.status(404).json({ error: 'Job not found' });
    }

    const prompt = `
You are Jeanie AI, an expert contractor bid advisor. Analyze the following job and recommend:

1. A competitive bid amount in USD.
2. A realistic timeline in days or weeks.
3. A short, friendly positioning note for the bid.

Job Title: ${job.title}
Job Description: ${job.description || 'No description provided.'}
Budget: ${job.budget ? `$${job.budget}` : 'No budget provided.'}

Respond in this JSON format:
{
  "bid_amount": "<number>",
  "timeline": "<string>",
  "note": "<string>"
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
    });

    const content = completion.choices[0].message.content?.trim();

    if (!content) {
      return res.status(500).json({ error: 'No content generated by Jeanie AI' });
    }

    // Attempt to parse the JSON returned
    try {
      const suggestion = JSON.parse(content);
      return res.status(200).json(suggestion);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw content:', content);
      return res.status(500).json({ error: 'Failed to parse AI response. Please try again.' });
    }
  } catch (error: any) {
    console.error('OpenAI generation error:', error.message);
    return res.status(500).json({ error: 'Server error generating suggestion' });
  }
}
