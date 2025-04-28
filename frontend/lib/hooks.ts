"use client";

import { Song } from "@/db/schema";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { SongWithUuid } from "./utils";

export function useDebounce(value: any, delay: number) {
  /**
   * Hook that returns a debounced value
   * @param value - The value to be debounced
   * @param delay - The delay in milliseconds
   * @returns debouncedValue - The debounced value
   */
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debounceValue;
}

export function useSelectedSong() {
  const [selectedSong, setSelectedSong] = useLocalStorage<Song | undefined>(
    "selectedSong",
    undefined,
  );
  return { selectedSong, setSelectedSong };
}

export function usePlaylist() {
  const [playlist, setPlaylist] = useLocalStorage<SongWithUuid[]>(
    "playlist",
    [],
  );
  return { playlist, setPlaylist };
}
