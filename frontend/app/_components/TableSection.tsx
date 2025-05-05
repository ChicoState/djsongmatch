import ClientOnly from "@/lib/ClientOnly";
import PlaylistTable from "./PlaylistTable";
import RecommendationTable from "./RecommendationTable";

export default function TableSection() {
  return (
    <div className="flex gap-4 px-16 w-full h-full">
      <ClientOnly>
        <RecommendationTable />
        <PlaylistTable />
      </ClientOnly>
    </div>
  );
}
