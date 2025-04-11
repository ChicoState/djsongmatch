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
import { type SongWithUuid, cn } from "@/lib/utils";
import { CircleMinusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import TitleArtist from "./TitleArtist";

export default function PlaylistTable() {
  const [playlist, setPlaylist] = useState<SongWithUuid[]>([]);
  const [removeInProgress, setRemoveInProgress] = useState<SongWithUuid[]>([]);

  useEffect(() => {
    const getPlaylist = () => {
      const playlistStr = window.localStorage.getItem("playlist");
      const playlist: SongWithUuid[] =
        playlistStr !== null ? JSON.parse(playlistStr) : [];
      setPlaylist(playlist);
    };
    getPlaylist();
    window.addEventListener("addSongPlaylist", getPlaylist);
    return () => {
      window.removeEventListener("addSongPlaylist", getPlaylist);
    };
  }, []);

  const removeSong = (song: SongWithUuid) => {
    setRemoveInProgress([...removeInProgress, song]);
    setTimeout(() => {
      const newPlaylist = playlist.filter((s) => s.uuid !== song.uuid);
      window.localStorage.setItem("playlist", JSON.stringify(newPlaylist));
      setPlaylist(newPlaylist);
      setRemoveInProgress(removeInProgress.filter((s) => s.uuid !== song.uuid));
    }, 200);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center w-full transition-opacity duration-300",
        playlist.length === 0 && "opacity-25",
      )}
    >
      <h2 className="text-2xl">Your Playlist</h2>
      <Table className="border border-border">
        <TableHeader>
          <TableRow className="text-xl text-secondary-foreground bg-secondary hover:bg-secondary">
            <TableHead className="font-bold">Track</TableHead>
            <TableHead className="font-bold text-right">Key</TableHead>
            <TableHead className="font-bold text-right">BPM</TableHead>
            <TableHead className="w-[16px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playlist.map((song) => {
            return (
              <TableRow
                className={cn(
                  "text-lg opacity-100 transition-all duration-200",
                  removeInProgress.includes(song) ? "scale-75 opacity-25" : "",
                )}
                key={song.uuid}
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
                      <CircleMinusIcon
                        onMouseDown={() => removeSong(song)}
                        className="transition-all duration-200 cursor-pointer hover:scale-110 text-destructive hover:text-destructive/80"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={8}>
                      <p className="text-lg">Remove from playlist</p>
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
