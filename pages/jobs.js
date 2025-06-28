import { useEffect, useState } from 'react';
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

export default function JobsPage() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/jobs?select=*&user_id=eq.${user.id}`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          }
        }
      );

      const data = await response.json();
      setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, [user]);

  const handleDelete = async (jobId) => {
    const res = await fetch('/api/delete-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jobId }),
    });

    if (res.ok) {
      setJobs(jobs.filter((job) => job.id !== jobId));
    } else {
      alert('Failed to delete job.');
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <SignedIn>
        <h1>🗂️ Your Job Listings</h1>

        {loading && <p>Loading jobs...</p>}

        {!loading && jobs.length === 0 && <p>No jobs submitted yet.</p>}

        {!loading && jobs.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {jobs.map((job) => (
              <li key={job.id} style={{
                marginBottom: '1rem',
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                position: 'relative'
              }}>
                <h2>{job.title}</h2>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Date:</strong> {job.date}</p>
                <p><strong>Budget:</strong> ${job.budget}</p>
                <p><strong>Urgent:</strong> {job.urgency ? 'Yes' : 'No'}</p>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  Posted: {new Date(job.created_at).toLocaleString()}
                </p>

                <button
                  onClick={() => handleDelete(job.id)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#e00',
                    color: '#fff',
                    border: 'none',
                    padding: '0.4rem 0.7rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </SignedIn>

      <SignedOut>
        <p>Please sign in to view your jobs.</p>
        <SignInButton mode="modal">
          <button style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </main>
  );
}

