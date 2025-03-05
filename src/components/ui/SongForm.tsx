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
  const [songId, setSongId] = useState<string>();

  // useQuery uesd for caching and getting whether data is loading/errors etc
  const { data } = useQuery({
    queryKey: ["song", songId],
    queryFn: async () => {
      const song = await getSong(Number(songId));
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

  // function that gets called when the form is submitted
  const handleSubmit = (formData: FormData) => {
    // songId comes from name="songId" in <input> below
    const songId = formData.get("songId");
    if (!songId) return; // just null check
    // update component's songId variable
    setSongId(songId.toString());
  };

  // <input name="songId" className="border border-background" />
  return (
    <Form className="flex flex-col gap-4 grow-[1]" action={handleSubmit}>
      <p className="text-2xl text-center text-foreground">Search for a song!</p>
      <SongAutocomplete
        onSelect={(selectedSong: Song) => {
          setSongId(selectedSong.songId.toString());
        }}
      />
      <button className="self-center p-4 w-24 bg-green-200" type="submit">
        Generate
      </button>
    </Form>
  );
}
