'use client'; // Make this a client component

import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <div suppressHydrationWarning>{children}</div>
      </ThemeProvider>
    </ClerkProvider>
  );
}
