import TopNav from "./_components/TopNav";
import { Providers } from "./providers";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <TopNav />
      {children}
    </Providers>
  )
}
