import TopNav from "./_components/TopNav";
import { Providers } from "./providers";

export const metadata = {
  title: "DJ Song Match",
  description: "AI song matching",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <Providers>
          <TopNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
