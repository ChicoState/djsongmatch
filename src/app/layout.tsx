export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <main className="flex flex-col gap-12 p-12 h-screen">
          <h1 className="self-center text-6xl text-foreground">
            DJ Song Match!
          </h1>
          {children}
        </main>
      </body>
    </html>
  );
}
