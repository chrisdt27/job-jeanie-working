// pages/bid/[id].tsx
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BidPage() {
  const { user } = useUser();
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isHourly, setIsHourly] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function fetchJob() {
      if (!user || !id) return;
      const token = await user.getToken();
      const res = await fetch(`/api/get-job?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setJob(data);
    }
    fetchJob();
  }, [user, id]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const token = await user.getToken();
    const res = await fetch('/api/submit-bid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        job_id: id,
        bid_amount: parseFloat(bidAmount),
        is_hourly,
        message,
      }),
    });
    if (res.ok) {
      setStatus('✅ Bid submitted successfully');
      setTimeout(() => router.push('/contractor-dashboard'), 1500);
    } else {
      const error = await res.json();
      setStatus(`❌ ${error.error || 'Failed to submit bid'}`);
    }
  }

  if (!job) return <div className="p-4">Loading job info...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">Bid on: {job.title}</h1>
      <p className="mb-4">{job.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Bid Amount"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <label className="block">
          <input
            type="checkbox"
            checked={isHourly}
            onChange={(e) => setIsHourly(e.target.checked)}
            className="mr-2"
          />
          Is this an hourly bid?
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional message to job poster"
          className="w-full border px-4 py-2 rounded"
        ></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Bid
        </button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}
