"use client";
import "@/app/globals.css";

import ButtonSliderSection from "./_components/ButtonSliderSection";
import SearchBarSection from "./_components/SearchBarSection";
import { useState } from "react";
import { Song } from "@/db/schema";

export default function App() {
  const [inputSong, setInputSong] = useState<Song | null>(null);
  return (
    <main className="flex flex-col justify-center items-center">
      <ButtonSliderSection inputSong={inputSong} />
      <SearchBarSection setInputSong={setInputSong} />
    </main>
  );
}
