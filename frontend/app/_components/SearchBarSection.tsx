"use client";

import "@/app/globals.css";
import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Song } from "@/db/schema";
import { useDebounce } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { searchSongs } from "../actions";

interface SearchBarSectionProps {
  /**
   * @param setInputSong - A function that gets called when the user selects a song from the search results
   */
  setInputSong: (song: Song) => void;
}

function SearchBarSection({ setInputSong }: SearchBarSectionProps) {
  /* Whether the search bar is focused or not */
  const [open, setOpen] = useState(false);

  /* What the user has typed in the search bar */
  const [inputValue, setInputValue] = useState("");

  /* What the user has selected from the search results */
  const [value, setValue] = useState("");

  /* Second param of useDebounce is how many milliseconds
   * should the input wait since the user stopped typing
   * before triggering the search. This is to prevent
   * the database from being hit too often.
   */
  const debouncedInput = useDebounce(inputValue, 150);

  const { data: songs = [] } = useQuery({
    /* Only search the database debouncedInput changes */
    queryKey: ["songList", debouncedInput],

    queryFn: () => {
      return searchSongs(debouncedInput);
    },

    /* Keep the previous data until the database returns new data */
    placeholderData: (previousData) => previousData,

    /* Only search database when user has typed something */
    enabled: inputValue.trim().length > 0,
  });

  return (
    <div className="py-8 w-full max-w-4xl">
      <div className="w-1/2">
        <Command className="border border-border">
          <CommandInput
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onValueChange={setInputValue}
            placeholder={"Search for a song!"}
            value={inputValue}
          />

          {/* Only show the choices if the user has the input focused */}
          {open && (
            <CommandList>
              {/* Used to remove the "No results found" message when the user selects a song */}
              {value != inputValue && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {songs.map((song: Song) => {
                return (
                  <CommandItem
                    key={song.songId}
                    value={`${song.artist} - ${song.title}`}
                    onMouseDown={() => {
                      setValue(`${song.artist} - ${song.title}`);
                      setInputValue(`${song.artist} - ${song.title}`);
                      setInputSong(song);
                    }}
                  >
                    {song.artist} - {song.title}
                  </CommandItem>
                );
              })}
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
}

export default SearchBarSection;
