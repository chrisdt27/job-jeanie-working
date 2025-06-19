import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      {/* 🔐 Login/Logout Section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* 💼 Main Content */}
      <h1>Welcome to Job Jeanie 🧞‍♀️</h1>
      <p>Your AI-powered platform to connect homeowners with skilled service pros and freelance talent.</p>

      <ul>
        <li><a href="/job-wizard">Post a Job</a></li>
        <li><a href="/jobs">View All Jobs</a></li>
      </ul>
    </main>
  );
}

