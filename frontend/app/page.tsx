"use client";
import "@/app/globals.css";

import type { Song } from "@/db/schema";
import { useState } from "react";
import ButtonSliderSection from "./_components/ButtonSliderSection";
import SearchBarSection from "./_components/SearchBarSection";
import TableSection from "./_components/TableSection";

export default function App() {
  const [inputSong, setInputSong] = useState<Song | null>(null);
  return (
    <main className="flex flex-col justify-center items-center">
      <ButtonSliderSection inputSong={inputSong} />
      <SearchBarSection setInputSong={setInputSong} />
      <TableSection />
    </main>
  );
}
