"use client";
import TopNav from "./_components/TopNav";
import { Providers } from "./providers";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const hideTopNav = pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <Providers>
          {!hideTopNav && <TopNav />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
