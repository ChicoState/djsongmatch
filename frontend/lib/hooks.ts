"use client";

import { Song } from "@/db/schema";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { SongWithUuid } from "./utils";

export function useDebounce<T>(value: T, delay: number) {
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

/* All possible parameters for recommendation algorithm */
export type Parameter =
  | "danceability"
  | "energy"
  | "loudness"
  | "speechiness"
  | "acousticness"
  | "instrumentalness"
  | "liveness"
  | "valence";

export interface ParameterData {
  parameter: Parameter;
  sliderValue: number;
  locked: boolean;
}

export interface AllParameters {
  danceability?: ParameterData;
  setDanceability: (value: ParameterData) => void;
  energy?: ParameterData;
  setEnergy: (value: ParameterData) => void;
  loudness?: ParameterData;
  setLoudness: (value: ParameterData) => void;
  speechiness?: ParameterData;
  setSpeechiness: (value: ParameterData) => void;
  acousticness?: ParameterData;
  setAcousticness: (value: ParameterData) => void;
  instrumentalness?: ParameterData;
  setInstrumentalness: (value: ParameterData) => void;
  liveness?: ParameterData;
  setLiveness: (value: ParameterData) => void;
  valence?: ParameterData;
  setValence: (value: ParameterData) => void;
}

export function useParameter(parameter: Parameter) {
  return useLocalStorage<ParameterData | undefined>(
    `slider.${parameter}`,
    undefined,
  );
}

export function useParameters(): AllParameters {
  const [danceability, setDanceability] = useParameter("danceability");
  const [energy, setEnergy] = useParameter("energy");
  const [loudness, setLoudness] = useParameter("loudness");
  const [speechiness, setSpeechiness] = useParameter("speechiness");
  const [acousticness, setAcousticness] = useParameter("acousticness");
  const [instrumentalness, setInstrumentalness] =
    useParameter("instrumentalness");
  const [liveness, setLiveness] = useParameter("liveness");
  const [valence, setValence] = useParameter("valence");

  return {
    danceability,
    setDanceability,
    energy,
    setEnergy,
    loudness,
    setLoudness,
    speechiness,
    setSpeechiness,
    acousticness,
    setAcousticness,
    instrumentalness,
    setInstrumentalness,
    liveness,
    setLiveness,
    valence,
    setValence,
  };
}

export function useYearFilter() {
  const [startYear, setStartYear] = useLocalStorage<number | undefined>(
    "yearFilter.startYear",
    undefined,
  );
  const [endYear, setEndYear] = useLocalStorage<number | undefined>(
    "yearFilter.endYear",
    undefined,
  );
  return { startYear, setStartYear, endYear, setEndYear };
}
