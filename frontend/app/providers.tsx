"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Provides application-wide context providers for data fetching and theming.
 *
 * This component wraps its children with providers such as `QueryClientProvider` for TanStack Query
 * and `ThemeProvider` for managing the application's theme.
 *
 * @param {React.ReactNode} props.children - The child components to be wrapped.
 *
 * @example
 * <Providers>
 * <App />
 * </Providers>
 *
 * @remarks
 * - Initializes a new `QueryClient` instance using `useState` for efficient re-renders.
 * - The QueryClientProvider provides features like data caching, loading states, and error handling
 * - Configures `ThemeProvider` to use the 'class' attribute, system default theme,
 * enables system theme detection, and disables transition on theme change.
 * - This component should be used at the root level of our application to ensure
 * consistent data fetching and theming throughout.
 * - Wrapping providers in a client component that gets imported instead of around our
 *   layout.tsx stops layout.tsx from being a client component unnecessarily
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
