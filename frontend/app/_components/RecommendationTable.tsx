import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Song } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CirclePlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getSongRecommendations } from "../actions";

interface RecommendationTableProps {
  setPlaylist: (songs: Song[]) => void;
}

export default function RecommendationTable() {
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId");

  /* Fade the table when a song isn't chosen yet */
  const tableOpacity = songId === null ? "opacity-25" : "opacity-100";

  const { data: songs = [] } = useQuery({
    queryKey: ["songRecommendations", songId],
    queryFn: () => {
      return getSongRecommendations();
    },
  });

  const addSong = (song: Song) => {
    const songsStr = window.localStorage.getItem("playlist");
    const songs: Song[] = songsStr !== null ? JSON.parse(songsStr) : [];
    songs.push(song);
    window.localStorage.setItem("playlist", JSON.stringify(songs));
    window.dispatchEvent(new Event("addSongPlaylist"));
  };

  return (
    <Table
      className={cn(
        "transition-opacity duration-300 border border-border",
        tableOpacity,
      )}
    >
      <TableHeader>
        <TableRow className="text-xl">
          <TableHead className="font-bold">Track</TableHead>
          <TableHead className="font-bold text-right">Key</TableHead>
          <TableHead className="font-bold text-right">BPM</TableHead>
          <TableHead className="w-[16px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song) => {
          return (
            <TableRow className="text-lg" key={song.songId}>
              <TableCell>{song.title}</TableCell>
              <TableCell className="text-right">{song.camelotKeyId}</TableCell>
              <TableCell className="text-right">
                {Math.round(song.tempo)}
              </TableCell>
              <TableCell className="pr-4 pl-8">
                <div title="Add to playlist">
                  <CirclePlusIcon
                    onMouseDown={() => addSong(song)}
                    className="cursor-pointer text-chart-2"
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
