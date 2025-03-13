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
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { searchSongs } from "../actions";
import { Song } from "@/db/schema";

const queryClient = new QueryClient();

function SearchBarSection() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState("");

  const { data: songs = [] } = useQuery({
    queryKey: ["songList", inputValue],
    queryFn: () => {
      return searchSongs(inputValue);
    },
    enabled: inputValue.trim().length >= 3,
  });

  return (
    <QueryClientProvider client={queryClient}>
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
            {open && (
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {songs.map((song: Song) => {
                  return (
                    <CommandItem
                      key={song.songId}
                      value={`${song.artist} - ${song.title}`}
                      onMouseDown={() => {
                        setValue(`${song.artist} - ${song.title}`);
                        setInputValue(`${song.artist} - ${song.title}`);
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
    </QueryClientProvider>
  );
}

export default SearchBarSection;
