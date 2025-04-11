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
  /* Which songs are in the playlist */
  const [playlist, setPlaylist] = useState<SongWithUuid[]>([]);

  /* These two states are purely for animation */
  const [addInProgress, setAddInProgress] = useState<SongWithUuid[]>([]);
  const [removeInProgress, setRemoveInProgress] = useState<SongWithUuid[]>([]);

  useEffect(() => {
    /*
     * getPlaylist() updates the playlist in React with whatever is in localStorage.
     * See when this gets called below.
     */
    const getPlaylist = () => {
      /* Fetch the playlist from localStorage */
      const playlistStr = window.localStorage.getItem("playlist");
      const newPlaylist: SongWithUuid[] =
        playlistStr !== null ? JSON.parse(playlistStr) : [];

      /* Find which songs are newly being added to the playlist */
      const newSongs = newPlaylist.filter(
        (song) => !playlist.some((s) => s.uuid === song.uuid),
      );

      /* Update React with the new playlist */
      setPlaylist(newPlaylist);

      /* For each new song, add it to the addInProgress array to give it a slight animation */
      newSongs.forEach((song) => {
        setAddInProgress([...addInProgress, song]);

        /* setTimeout is used to give the animation time to play */
        setTimeout(() => {
          /* Since the animation is done, we can remove the song from the addInProgress array */
          setAddInProgress(addInProgress.filter((s) => s.uuid !== song.uuid));
        }, 100);
      });
    };

    /* Get the playlist from localStorage on mount */
    getPlaylist();

    /*
     * This "addSongPlaylist" event gets sent by <RecommendationsTable /> when a song is added to the playlist.
     * Every time this event is triggered, we want to update the playlist in React with getPlaylist()
     */
    window.addEventListener("addSongPlaylist", getPlaylist);
    return () => {
      /*
       * When the component unmounts, remove the event listener.
       * This is because it re-adds the event listener every time the component re-renders.
       */
      window.removeEventListener("addSongPlaylist", getPlaylist);
    };
  }, []);

  const removeSong = (song: SongWithUuid) => {
    /* Add the song to the removeInProgress array to give it a slight animation */
    setRemoveInProgress([...removeInProgress, song]);

    /* setTimeout is used to give the animation time to play */
    setTimeout(() => {
      /* The most up to date playlist (with the removed song) */
      const newPlaylist = playlist.filter((s) => s.uuid !== song.uuid);

      /* Update localStorage with the new playlist without the song */
      window.localStorage.setItem("playlist", JSON.stringify(newPlaylist));

      /* Update React with the new playlist without the song */
      setPlaylist(newPlaylist);

      /* Successfully has been removed, so we can remove it from the removeInProgress array */
      setRemoveInProgress(removeInProgress.filter((s) => s.uuid !== song.uuid));
    }, 100);
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
                  "text-lg opacity-100 transition-all duration-100",
                  addInProgress.includes(song) ||
                    removeInProgress.includes(song)
                    ? "scale-75 opacity-25"
                    : "",
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
