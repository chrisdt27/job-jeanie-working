import { useEffect, useState } from 'react';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs?select=*`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      const data = await response.json();
      setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🗂️ Job Listings</h1>

      {loading && <p>Loading jobs...</p>}

      {!loading && jobs.length === 0 && <p>No jobs posted yet.</p>}

      {!loading && jobs.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <h2>{job.title}</h2>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Date:</strong> {job.date}</p>
              <p><strong>Budget:</strong> ${job.budget}</p>
              <p><strong>Urgent:</strong> {job.urgency ? 'Yes' : 'No'}</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Posted: {new Date(job.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
