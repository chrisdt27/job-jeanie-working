import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to Job Jeanie 👋</h1>
      <p>This is your MVP homepage.</p>
      <p>Click below to start a new job post with Jeanie:</p>

      <Link href="/job-wizard">
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Start Job Wizard
        </button>
      </Link>
    </main>
  );
}
