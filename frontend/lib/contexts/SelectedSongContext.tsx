import { Song } from "@/db/schema";
import { createContext, ReactNode, useContext, useState } from "react";

type SelectedSongContextType = {
  selectedSong: Song | undefined;
  setSelectedSong: (song: Song) => void;
};

const SelectedSongContext = createContext<SelectedSongContextType | undefined>(
  undefined,
);

export function SelectedSongProvider({ children }: { children: ReactNode }) {
  const [song, setSong] = useState<Song | undefined>(undefined);
  return (
    <SelectedSongContext.Provider
      value={{ selectedSong: song, setSelectedSong: setSong }}
    >
      {children}
    </SelectedSongContext.Provider>
  );
}

export function useSelectedSong(): SelectedSongContextType {
  const context = useContext(SelectedSongContext);
  if (context === undefined) {
    throw new Error("useHeatmap must be used within a HeatmapProvider");
  }
  return context;
}
