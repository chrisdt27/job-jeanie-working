// pages/contractor-bids.tsx
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ContractorBidsPage() {
  const { user } = useUser();
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchBids = async () => {
      try {
        const token = await user.getToken();
        const res = await fetch('/api/my-bids', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch bids');
        setBids(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [user]);

  const withdrawBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to withdraw this bid?')) return;

    try {
      const token = await user?.getToken();
      const res = await fetch('/api/withdraw-bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bidId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to withdraw bid');
      setBids((prev) => prev.filter((bid) => bid.id !== bidId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Bids</h1>
      {bids.length === 0 ? (
        <p>No bids submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {bids.map((bid) => (
            <li key={bid.id} className="border p-4 rounded shadow">
              <p><strong>Job:</strong> {bid.job_title || 'Untitled'}</p>
              <p><strong>Amount:</strong> ${bid.amount}</p>
              <p><strong>Status:</strong> {bid.accepted ? '✅ Accepted' : '⏳ Pending'}</p>
              {!bid.accepted && (
                <button
                  onClick={() => withdrawBid(bid.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Withdraw Bid
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
