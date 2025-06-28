import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

export default function TestJobsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const fetchJobs = async () => {
        try {
          const token = await getToken();
          console.log('Calling /api/jobs with token:', token);

          const res = await fetch('/api/jobs', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Response status:', res.status);
          const raw = await res.text();
          console.log('Raw response body:', raw);

          const data = JSON.parse(raw);
          console.log('Jobs returned from API:', data);
          setJobs(data);
        } catch (error) {
          console.error('Error fetching jobs:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobs();
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) return <p>Loading authentication...</p>;
  if (!isSignedIn) return <p>Please sign in to view your jobs.</p>;

  return (
    <div>
      <h1>Fetch My Jobs</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <ul>
          {jobs.map((job: any) => (
            <li key={job.id}>
              {job.description} ({job.location})
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}

