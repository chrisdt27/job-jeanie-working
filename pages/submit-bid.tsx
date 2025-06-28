// pages/submit-bid.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function SubmitBidPage() {
  const router = useRouter();
  const { jobId } = router.query;
  const { user } = useUser();

  const [bidAmount, setBidAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const handleGetSuggestion = async () => {
    if (!jobId) {
      toast.error('Missing job ID.');
      return;
    }
    setSuggesting(true);
    try {
      const res = await fetch('/api/generate-bid-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (res.ok) {
        setBidAmount(data.bid_amount || '');
        setTimeline(data.timeline || '');
        setNotes(data.note || '');
        toast.success('Jeanie AI suggestion applied!');
      } else {
        toast.error(data.error || 'Failed to get suggestion.');
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      toast.error('Error fetching suggestion.');
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!bidAmount || !timeline || !notes) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/submit-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          contractor_id: user?.id,
          bid_amount: parseFloat(bidAmount),
          timeline,
          notes,
          bid_type: 'Firm Fixed Price',
          status: 'submitted',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Bid submitted successfully!');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Error submitting bid.');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error('Error submitting bid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Submit a Bid</h1>

      <button
        onClick={handleGetSuggestion}
        disabled={suggesting}
        style={{
          padding: '10px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {suggesting ? 'Generating Suggestion...' : 'Get Jeanie AI Suggestion'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="number"
          placeholder="Bid Amount ($)"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Timeline (e.g., 2 weeks)"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <textarea
          placeholder="Notes to the owner"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '10px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </div>
    </div>
  );
}
