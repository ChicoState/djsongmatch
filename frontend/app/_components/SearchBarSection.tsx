"use client";

import "@/app/globals.css";
import { useEffect, useRef, useState } from "react";

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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const handleSelect = (song: Song) => {
    /* When user chooses an item from the search results */
    setValue(`${song.artist} - ${song.title}`);
    setInputValue(`${song.artist} - ${song.title}`);
    setInputSong(song);

    /* Update params */
    const newParams = new URLSearchParams(params.toString());
    newParams.set("songId", song.songId.toString());
    router.push(pathname + "?" + newParams.toString());
  };

  /* Basically pointer to the CommandList element */
  const CommandListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (CommandListRef.current) {
      /* Every time the user input changes, scroll to the top of the list.
       * The most relevant song is probably at the top */
      CommandListRef.current.scrollTop = 0;
    }
  }, [inputValue]);

  return (
    <div className="py-8 w-full max-w-4xl">
      <div className="relative w-1/2">
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
            <CommandList
              ref={CommandListRef}
              className="absolute top-full w-full border bg-background text-foreground z-[50] border-border"
            >
              {/* Used to remove the "No results found" message when the user selects a song */}
              {value != inputValue && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {songs.map((song: Song) => {
                return (
                  <CommandItem
                    key={song.songId}
                    value={`${song.artist} - ${song.title}`}
                    /* I have no idea why onSelect isn't
                     * registering mouse clicks as selection.
                     * Just use both :P */
                    onSelect={() => handleSelect(song)}
                    onMouseDown={() => handleSelect(song)}
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
