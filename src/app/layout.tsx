"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="bg-background">
        <QueryClientProvider client={queryClient}>
          <main className="flex flex-col gap-12 p-12 h-screen">
            <h1 className="self-center text-6xl text-foreground">
              DJ Song Match!
            </h1>
            {children}
          </main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
