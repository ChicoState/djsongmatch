"use client";
import "@/app/globals.css";

import ButtonSliderSection from "./_components/ButtonSliderSection";
import { SearchBar, SearchBarSection } from "./_components/SearchBarSection";
import TableSection from "./_components/TableSection";
import ClientOnly from "@/lib/ClientOnly";
import { useSelectedSong } from "@/lib/hooks";

function NoSongSelected() {
  return (
    <main className="flex justify-center items-center h-1/2">
      <div className="flex flex-col justify-center items-center w-1/2 gap-4">
        <h1>First, please select a song to generate a recommendation for!</h1>
        <SearchBar />
      </div>
    </main>
  );
}

export function App() {
  const { selectedSong } = useSelectedSong();
  if (selectedSong == undefined) {
    return <NoSongSelected />;
  }

  return (
    <main className="flex flex-col justify-center items-center">
      <ButtonSliderSection />
      <SearchBarSection />
      <TableSection />
    </main>
  );
}

export default function Page() {
  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  );
}
