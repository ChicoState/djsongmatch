"use client";
import { useIsClient } from "@uidotdev/usehooks";

/**
 * @description
 * ClientOnly is a component that renders its children only on the client.
 * Useful for components that use client-specific hooks or features like localStorage.
 *
 * @param children - The children to render.
 *
 * @example
 *  <ClientOnly>
 *    <RecommendationTable />
 *    <PlaylistTable />
 *  </ClientOnly>
 */
export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }
  return <>{children}</>;
}
