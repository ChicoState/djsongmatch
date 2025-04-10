import { MoveRightIcon } from "lucide-react";
import PlaylistTable from "./PlaylistTable";
import RecommendationTable from "./RecommendationTable";

export default function TableSection() {
  return (
    <div className="flex gap-4 px-16 w-full">
      <div className="w-full">
        <RecommendationTable />
      </div>
      <MoveRightIcon className="self-center" />
      <div className="w-full">
        <PlaylistTable />
      </div>
    </div>
  );
}
