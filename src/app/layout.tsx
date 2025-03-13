import { ThemeProvider } from "@/components/theme-provider";
import TopNav from "./_components/TopNav";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
