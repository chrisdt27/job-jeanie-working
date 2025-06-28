import { useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

export default function JobWizard() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    budget: '',
    urgency: false,
  });

  const [status, setStatus] = useState(null);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const token = await getToken(); // 🔐 Clerk JWT token

    const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        ...formData,
        created_at: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      setStatus('✅ Job submitted successfully.');
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        budget: '',
        urgency: false,
      });
    } else {
      const error = await response.json();
      console.error("❌ Submission failed:", error);
      setStatus(`❌ Submission failed: ${JSON.stringify(error)}`);
    }
  };

  if (!isSignedIn) return <p>Please sign in to post a job.</p>;

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📝 Post a Job</h1>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required />
        <input name="budget" type="number" placeholder="Budget" value={formData.budget} onChange={handleChange} required />
        <label>
          <input name="urgency" type="checkbox" checked={formData.urgency} onChange={handleChange} />
          Urgent?
        </label>
        <button type="submit">Submit Job</button>
      </form>
    </main>
  );
}

