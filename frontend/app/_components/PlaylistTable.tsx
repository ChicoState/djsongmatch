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
import { CircleMinusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function PlaylistTable() {
  /* Fade the table when a song isn't chosen yet */
  const tableOpacity = "opacity-100";

  const [playlist, setPlaylist] = useState<Song[]>([]);

  useEffect(() => {
    const getPlaylist = () => {
      const playlistStr = window.localStorage.getItem("playlist");
      const playlist: Song[] =
        playlistStr !== null ? JSON.parse(playlistStr) : [];
      setPlaylist(playlist);
    };
    getPlaylist();
    window.addEventListener("addSongPlaylist", getPlaylist);
    return () => {
      window.removeEventListener("addSongPlaylist", getPlaylist);
    };
  }, []);

  const removeSong = (playlistIndex: number) => {
    const playlistStr = window.localStorage.getItem("playlist");
    const playlist: Song[] =
      playlistStr !== null ? JSON.parse(playlistStr) : [];
    playlist.splice(playlistIndex, 1);
    window.localStorage.setItem("playlist", JSON.stringify(playlist));
    setPlaylist(playlist);
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
        {playlist.map((song, index) => {
          return (
            <TableRow className="text-lg" key={`${song.songId}.${index}`}>
              <TableCell>{song.title}</TableCell>
              <TableCell className="text-right">{song.camelotKeyId}</TableCell>
              <TableCell className="text-right">
                {Math.round(song.tempo)}
              </TableCell>
              <TableCell className="pr-4 pl-8">
                <div title="Remove from playlist">
                  <CircleMinusIcon
                    onMouseDown={() => removeSong(index)}
                    className="cursor-pointer text-destructive"
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
