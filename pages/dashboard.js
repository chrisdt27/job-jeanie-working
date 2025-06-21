import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div style={{ padding: '2rem' }}>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <h1 style={{ fontSize: '2rem' }}>Welcome, {user?.firstName} 👋</h1>
        <p>You are now viewing your personal dashboard.</p>
      </SignedIn>

      <SignedOut>
        <p>Please sign in to view your dashboard.</p>
      </SignedOut>
    </div>
  );
}
