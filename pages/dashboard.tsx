// Inside pages/dashboard.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const response = await fetch('/api/recommended-jobs');
        const data = await response.json();
        setRecommendedJobs(data);
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        toast.error('Error loading recommended jobs.');
      }
    };

    fetchRecommendedJobs();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>

      <section style={{ marginTop: '30px' }}>
        <h2>Recommended Jobs for You</h2>

        {recommendedJobs.length === 0 ? (
          <p>No recommended jobs available at this time.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                }}
              >
                <h3>{job.title}</h3>
                <p>
                  <strong>Budget:</strong> ${job.budget || 'Not specified'}
                </p>
                <p>
                  <strong>Pricing Preference:</strong> {job.pricing_preference || 'Either'}
                </p>
                <p style={{ fontSize: '0.9em', color: '#555' }}>
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => router.push(`/submit-bid?jobId=${job.id}`)}
                  style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    backgroundColor: '#0070f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  View & Bid
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
