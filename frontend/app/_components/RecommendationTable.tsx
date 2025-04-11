import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Song } from "@/db/schema";
import { type SongWithUuid, cn, generateSongUuid } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CirclePlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getSongRecommendations } from "../actions";
import TitleArtist from "./TitleArtist";

interface RecommendationTableProps {
  setPlaylist: (songs: SongWithUuid[]) => void;
}

export default function RecommendationTable() {
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId");

  const { data: songs = [] } = useQuery({
    queryKey: ["songRecommendations", songId],
    queryFn: () => {
      return getSongRecommendations(Number.parseInt(songId!));
    },
    enabled: songId !== null,
  });

  const addSong = (song: Song) => {
    const songsStr = window.localStorage.getItem("playlist");
    const songs: SongWithUuid[] = songsStr !== null ? JSON.parse(songsStr) : [];
    songs.push(generateSongUuid(song));
    window.localStorage.setItem("playlist", JSON.stringify(songs));
    window.dispatchEvent(new Event("addSongPlaylist"));
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center w-full transition-opacity duration-300",
        songId === null && "opacity-25",
      )}
    >
      <h2 className="text-2xl">Our Recommendations</h2>
      <Table className="overflow-scroll border border-border">
        <TableHeader>
          <TableRow className="text-xl bg-secondary text-secondary-foreground hover:bg-secondary">
            <TableHead className="font-bold">Track</TableHead>
            <TableHead className="font-bold text-right">Key</TableHead>
            <TableHead className="font-bold text-right">BPM</TableHead>
            <TableHead className="w-[16px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => {
            return (
              <TableRow
                className="text-lg text-accent-foreground"
                key={song.songId}
              >
                <TableCell>
                  <TitleArtist title={song.title} artist={song.artist} />
                </TableCell>
                <TableCell className="text-right">
                  {song.camelotKeyId}
                </TableCell>
                <TableCell className="text-right">
                  {Math.round(song.tempo)}
                </TableCell>
                <TableCell className="pr-4 pl-8">
                  <Tooltip disableHoverableContent={true}>
                    <TooltipTrigger>
                      <CirclePlusIcon
                        onMouseDown={() => addSong(song)}
                        className="duration-200 cursor-pointer hover:scale-110 text-chart-2 hover:text-chart-2/80"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={8}>
                      <p className="text-lg">Add to playlist</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
