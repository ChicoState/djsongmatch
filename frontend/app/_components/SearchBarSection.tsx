"use client";

import "@/app/globals.css";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Song } from "@/db/schema";
import {
  ParameterData,
  useDebounce,
  useParameter,
  useSelectedSong,
} from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { searchSongs } from "../actions";

function songToLabel(song: Song) {
  return `${song.artist} - ${song.title}`;
}

const updateParameter = (
  song: Song,
  setter: (data: ParameterData) => void,
  paramData?: ParameterData,
) => {
  if (paramData === undefined) return;
  if (paramData.locked) return;
  setter({
    parameter: paramData.parameter,
    sliderValue: song[paramData.parameter],
    locked: paramData.locked ?? false,
  });
};

/**
 */
export function SearchBar({
  startingInputValue,
}: {
  startingInputValue?: string;
}) {
  /* Whether the search bar is focused or not */
  const [open, setOpen] = useState(false);

  /* What the user has typed in the search bar */
  const [inputValue, setInputValue] = useState(startingInputValue ?? "");

  /* What the user has selected from the search results */
  const { selectedSong: song, setSelectedSong: setSong } = useSelectedSong();

  /* Second param of useDebounce is how many milliseconds
   * should the input wait since the user stopped typing
   * before triggering the search. This is to prevent
   * the database from being hit too often.
   */
  const debouncedInput = useDebounce(inputValue, 150);

  /* Basically pointer to the CommandList element */
  const CommandListRef = useRef<HTMLDivElement>(null);

  const { data: songs = [] } = useQuery({
    /* Only search the database debouncedInput changes */
    queryKey: ["songList", debouncedInput],

    queryFn: () => {
      return searchSongs(debouncedInput);
    },

    /* Keep the previous data until the database returns new data */
    placeholderData: (previousData) => previousData,

    /* Only search database when user has typed something */
    enabled: inputValue.trim().length > 0 && inputValue != startingInputValue,
  });

  useEffect(() => {
    if (CommandListRef.current) {
      /* Every time the user input changes, scroll to the top of the list.
       * The most relevant song is probably at the top */
      CommandListRef.current.scrollTop = 0;
    }
  }, [inputValue]);

  const [acousticness, setAcousticness] = useParameter("acousticness");
  const [danceability, setDanceability] = useParameter("danceability");
  const [energy, setEnergy] = useParameter("energy");
  const [instrumentalness, setInstrumentalness] =
    useParameter("instrumentalness");
  const [liveness, setLiveness] = useParameter("liveness");
  const [loudness, setLoudness] = useParameter("loudness");
  const [speechiness, setSpeechiness] = useParameter("speechiness");
  const [valence, setValence] = useParameter("valence");

  const handleSelect = useCallback(
    (song: Song) => {
      setInputValue(songToLabel(song));
      setSong(song);
      updateParameter(song, setAcousticness, acousticness);
      updateParameter(song, setDanceability, danceability);
      updateParameter(song, setEnergy, energy);
      updateParameter(song, setInstrumentalness, instrumentalness);
      updateParameter(song, setLiveness, liveness);
      updateParameter(song, setLoudness, loudness);
      updateParameter(song, setSpeechiness, speechiness);
      updateParameter(song, setValence, valence);
    },
    [
      acousticness,
      danceability,
      energy,
      instrumentalness,
      liveness,
      loudness,
      setAcousticness,
      setDanceability,
      setEnergy,
      setInputValue,
      setInstrumentalness,
      setLiveness,
      setLoudness,
      setSong,
      setSpeechiness,
      setValence,
      speechiness,
      valence,
    ],
  );

  return (
    <div className="relative w-full h-full">
      <Command className="border border-border">
        <CommandInput
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onValueChange={setInputValue}
          placeholder="Search for a song!"
          value={inputValue}
        />

        {/* Only show the choices if the user has the input focused */}
        {open && (
          <CommandList
            ref={CommandListRef}
            className="absolute top-full w-full border bg-background text-foreground z-[50] border-border"
          >
            {/* Used to remove the "No results found" message when the user selects a song */}
            {song && inputValue != songToLabel(song) && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {songs.map((song: Song) => {
              return (
                <CommandItem
                  key={song.songId}
                  value={songToLabel(song)}
                  /* I have no idea why onSelect isn't
                   * registering mouse clicks as selection.
                   * Just use both :P */
                  onSelect={() => handleSelect(song)}
                  onMouseDown={() => handleSelect(song)}
                >
                  {songToLabel(song)}
                </CommandItem>
              );
            })}
          </CommandList>
        )}
      </Command>
    </div>
  );
}

export function SearchBarSection() {
  const { selectedSong } = useSelectedSong();
  const startingInputValue = selectedSong
    ? songToLabel(selectedSong)
    : undefined;

  return (
    <div className="py-8 w-full max-w-4xl">
      <div className="w-1/2">
        <SearchBar startingInputValue={startingInputValue} />
      </div>
    </div>
  );
}
