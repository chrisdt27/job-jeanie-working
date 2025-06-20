import { ClerkProvider } from '@clerk/nextjs';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();

  return (
    <ClerkProvider navigate={(to) => window.history.pushState(null, '', to)}>
      <Component {...pageProps} key={pathname} />
    </ClerkProvider>
  );
}

export default MyApp;
