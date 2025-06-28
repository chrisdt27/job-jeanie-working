// pages/job/[id].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const router = useRouter();
  const { id: jobId } = router.query;
  const { user } = useUser();

  const [job, setJob] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  useEffect(() => {
    const fetchJobAndBids = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        const jobRes = await fetch(`/api/fetch-job-by-id?job_id=${jobId}`);
        const jobData = await jobRes.json();
        setJob(jobData);

        const bidsRes = await fetch(`/api/fetch-bids-for-job?job_id=${jobId}`);
        const bidsData = await bidsRes.json();
        setBids(bidsData);
      } catch (error) {
        console.error('Error fetching job and bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndBids();
  }, [jobId]);

  const handleGetAdvice = async (bidId: string) => {
    try {
      const res = await fetch('/api/generate-negotiation-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, bidId }),
      });
      const data = await res.json();

      if (res.ok) {
        setAdvice(data);
        toast.success('Jeanie AI advice retrieved!');
      } else {
        toast.error(data.error || 'Error fetching advice.');
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
      toast.error('Error fetching advice.');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Job Details</h1>
      {loading && <p>Loading job details...</p>}
      {job && (
        <div style={{ marginBottom: '20px' }}>
          <h2>{job.title}</h2>
          <p>{job.description || 'No description provided.'}</p>
          <p><strong>Budget:</strong> ${job.budget || 'N/A'}</p>
          <p><strong>Status:</strong> {job.status}</p>
        </div>
      )}

      <h2>Bids</h2>
      {bids.length === 0 && <p>No bids submitted yet.</p>}
      {bids.map((bid) => (
        <div key={bid.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
          <p><strong>Amount:</strong> ${bid.bid_amount}</p>
          <p><strong>Timeline:</strong> {bid.timeline}</p>
          <p><strong>Notes:</strong> {bid.notes}</p>
          <button
            onClick={() => handleGetAdvice(bid.id)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            Get Jeanie AI Advice
          </button>
        </div>
      ))}

      {advice && (
        <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #0070f3', borderRadius: '8px' }}>
          <h3>Jeanie AI Advice:</h3>
          <p><strong>Recommendation:</strong> {advice.recommendation}</p>
          {advice.recommendation === 'Counter' && advice.counter_offer && (
            <>
              <p><strong>Suggested Amount:</strong> ${advice.counter_offer.amount}</p>
              <p><strong>Suggested Timeline:</strong> {advice.counter_offer.timeline}</p>
            </>
          )}
          <p><strong>Explanation:</strong> {advice.explanation}</p>
        </div>
      )}
    </div>
  );
}
