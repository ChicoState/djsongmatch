import { Providers } from "../providers";

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      {children}
    </Providers>
  );
}

