// pages/_app.tsx

import type { AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
