"use client";
import "@/app/globals.css";

import { Song } from "@/frontend/lib/db/schema";
import { useState } from "react";
import ButtonSliderSection from "./_components/ButtonSliderSection";
import SearchBarSection from "./_components/SearchBarSection";

export default function App() {
  const [inputSong, setInputSong] = useState<Song | null>(null);
  return (
    <main className="flex flex-col justify-center items-center">
      <ButtonSliderSection inputSong={inputSong} />
      <SearchBarSection setInputSong={setInputSong} />
    </main>
  );
}
