"use client";
import { getSameKey, getSong } from "@/app/actions";
import { Song } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import Form from "next/form";
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
      if (!songId) return;
      const song = await getSong(songId);
      if (!song?.key) return;
      return getSameKey(song.key);
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
    <div className="flex flex-col gap-4 grow-[1]">
      <p className="text-2xl text-center text-foreground">Search for a song!</p>
      <SongAutocomplete
        onSelectAction={(selectedSong: Song) => {
          setSongId(selectedSong.songId);
        }}
      />
    </div>
  );
}
