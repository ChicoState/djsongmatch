"use client";
import "@/app/globals.css";

import type { Song } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ButtonSliderSection from "./_components/ButtonSliderSection";
import SearchBarSection from "./_components/SearchBarSection";
import { getRecommendedSongs } from "./actions";

export default function App() {
  const [inputSong, setInputSong] = useState<Song | null>(null);

  const {
    data: recommendedSongs,
    isError,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["recSongs", inputSong?.songId],
    queryFn: async () => {
      if (!inputSong) {
        console.log("WARNING: No input song");
        return null;
      }

      return getRecommendedSongs(inputSong.songId);
    },
    enabled: !!inputSong,
  });

  return (
    <main className="flex flex-col justify-center items-center">
      <ButtonSliderSection inputSong={inputSong} />
      <SearchBarSection setInputSong={setInputSong} />
      {isError && <div>Error: {error.message}</div>}
      {isLoading && <div>Fetching from flask. Loading...</div>}
      {isSuccess && (
        <div>Response from flask: "{recommendedSongs?.message}"</div>
      )}
    </main>
  );
}
