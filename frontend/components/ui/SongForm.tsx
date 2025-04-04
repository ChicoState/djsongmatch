/*
 * Client is archived for now ...
 *
"use client";
import { getSameKey, getSong } from "@/app/actions";
import { Song } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SongAutocomplete from "./SongAutocomplete";

interface SongFormProps {
  onFetchDataAction: (data: any) => void;
}

export default function SongForm({ onFetchDataAction }: SongFormProps) {
  // songId is like a local variable to the component
  // setSongId is used to update the songId of the component
  const [songId, setSongId] = useState<number>();

  // useQuery uesd for caching and getting whether data is loading/errors etc
  const { data } = useQuery({
    queryKey: ["song", songId],
    queryFn: async () => {
      if (songId == undefined) return;
      const song = await getSong(songId);
      if (song == undefined) return;
      return getSameKey(song);
    },
    enabled: !!songId,
  });

  // onFetchDataAction is a function passed by the parent of this component
  // to do stuff with the data within this component. Whenever data changes,
  // call this function with the necessary data
  useEffect(() => {
    if (data) {
      onFetchDataAction(data);
    }
  }, [data]);

  return (
    <div className="w-1/2">
      <SongAutocomplete
        onSelectAction={(selectedSong: Song) => {
          setSongId(selectedSong.songId);
        }}
      />
    </div>
  );
}
*/
