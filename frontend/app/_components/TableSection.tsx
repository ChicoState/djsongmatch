import { MoveRightIcon } from "lucide-react";
import PlaylistTable from "./PlaylistTable";
import RecommendationTable from "./RecommendationTable";

export default function TableSection() {
  return (
    <div className="flex gap-4 px-16 w-full h-full">
      <RecommendationTable />
      <MoveRightIcon className="self-center" />
      <PlaylistTable />
    </div>
  );
}
