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
import { camelotKeys, type Song } from "@/db/schema";
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
  /* searchParams is like `http://localhost:3000/?songId=1` */
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId");

  const { data: songs = []} = useQuery({
    queryKey: ["songRecommendations", songId],
    queryFn: () => {
      return getSongRecommendations(Number.parseInt(songId!));
    },
    enabled: songId !== null,
  });

  const addSong = (song: Song) => {
    /* Get the previous state of the playlist from localStorage */
    const songsStr = window.localStorage.getItem("playlist");

    /* localStorage returns a string, so we need to parse it into a JSON array */
    const songs: SongWithUuid[] = songsStr !== null ? JSON.parse(songsStr) : [];

    /* We need to generate a unique UUID for the song, so we could add the same song
     * with the same songId to the playlist multiple times, but could still tell them apart */
    songs.push(generateSongUuid(song));

    /* Update localStorage with the new playlist */
    window.localStorage.setItem("playlist", JSON.stringify(songs));

    /* Send an event that the <PlaylistTable /> component can listen for
     * that indicates that a song was added to the playlist */
    window.dispatchEvent(new Event("addSongPlaylist"));
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center w-full transition-opacity duration-300 h-192",
        /* If the user hasn't chosen a song yet, fade out the table */
        songs.length === 0 && "opacity-25",
      )}
    >
      <h2 className="text-2xl">Our Recommendations</h2>
      <Table className="border border-border">
        <TableHeader className="relative">
          <TableRow className="sticky top-0 text-xl bg-secondary text-secondary-foreground hover:bg-secondary">
            <TableHead className="sticky font-bold">Track</TableHead>
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
                  {song.camelotKeyStr}
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
