'use client'; // Make this a client component

import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>; // Avoids mismatch by not rendering until mounted
  }

  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
}
