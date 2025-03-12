"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import TopNav from "./_components/TopNav";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="bg-background">
        <QueryClientProvider client={queryClient}>
          <TopNav />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
