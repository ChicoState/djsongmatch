"use client";

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
import { cn, generateSongUuid } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CirclePlusIcon } from "lucide-react";
import { getSongRecommendations } from "../actions";
import TitleArtist from "./TitleArtist";
import { useCallback, useEffect } from "react";
import {
  usePlaylist,
  useSelectedSong,
  useParameter,
  useYearFilter,
} from "@/lib/hooks";

export default function RecommendationTable() {
  const { selectedSong } = useSelectedSong();
  const { playlist, setPlaylist } = usePlaylist();

  const [danceability] = useParameter("danceability");
  const [energy] = useParameter("energy");
  const [loudness] = useParameter("loudness");
  const [speechiness] = useParameter("speechiness");
  const [acousticness] = useParameter("acousticness");
  const [instrumentalness] = useParameter("instrumentalness");
  const [liveness] = useParameter("liveness");
  const [valence] = useParameter("valence");
  const { startYear, endYear } = useYearFilter();

  const { data: songs = [], refetch } = useQuery({
    queryKey: ["songRecommendations", selectedSong?.songId],
    queryFn: () => {
      if (selectedSong === undefined) {
        /* TODO: Visually represent that the songId is missing */
        console.log("WARNING: Generate button clicked without songId");
        return;
      }

      console.log("Fetching recommendations for songId", selectedSong.songId);

      /* Get recommendations from Flask */
      const recommendations = getSongRecommendations(selectedSong.songId, {
        danceability: danceability,
        energy: energy,
        loudness: loudness,
        speechiness: speechiness,
        acousticness: acousticness,
        instrumentalness: instrumentalness,
        liveness: liveness,
        valence: valence,
        start_year: startYear,
        end_year: endYear,
      });
      return recommendations.then((data) => {
        return [selectedSong, ...data];
      });
    },
    enabled: false,
  });

  const handleGenerateButtonClicked = useCallback(() => {
    refetch();
  }, [refetch]);

  /* This is a hacky way to make the table update when the generate button is clicked.
   * The reason we need to do this is because the generate button is not part of the
   * table, so we can't use the table's onClick handler to update the table.
   * Instead, we use a window event to trigger the refetch.
   * Better solutions are welcome.
   */
  useEffect(() => {
    window.addEventListener(
      "generateButtonClicked",
      handleGenerateButtonClicked,
    );
    return () => {
      window.removeEventListener(
        "generateButtonClicked",
        handleGenerateButtonClicked,
      );
    };
  });

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
                        onMouseDown={() =>
                          setPlaylist([...playlist, generateSongUuid(song)])
                        }
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
