// pages/edit-job.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser, useAuth } from '@clerk/nextjs';

export default function EditJobPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchJob() {
      if (!router.isReady || !id || typeof id !== 'string') return;

      const token = await getToken();
      const res = await fetch(`/api/get-job?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setMessage('Failed to load job.');
        return;
      }

      const data = await res.json();
      setTitle(data.title || '');
      setDescription(data.description || '');
      setLocation(data.location || '');
    }

    if (user) fetchJob();
  }, [id, user, getToken, router.isReady]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = await getToken();
    console.log('📦 Submitting job update for ID:', id); // Debug

    const res = await fetch('/api/edit-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        title,
        description,
        location,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage('✅ Job updated!');
      router.push('/dashboard');
    } else {
      const error = await res.json();
      setMessage(`❌ Update failed: ${error.error}`);
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Job'}
        </button>
      </form>
    </div>
  );
}
