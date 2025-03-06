"use client";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Song } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { searchSongs } from "@/app/actions";

interface SongAutocompleteProps {
  onSelect: (selectedSong: Song) => void;
}

export default function SongAutocomplete({ onSelect }: SongAutocompleteProps) {
  const [value, setValue] = useState<Song | null>(null);
  const [inputValue, setInputValue] = useState("");

  const {
    data: options = [],
  } = useQuery({
    queryKey: ["songList", inputValue], // only refetch when inputValue changes
    queryFn: ({ queryKey }) => searchSongs(queryKey[1]),
    enabled: inputValue.trim() !== "", // only fetch when input has value
    staleTime: 5 * 60 * 1000, // arbitary cache lifetime of 5 min
  });

  const handleValueChange = (
    _event: React.SyntheticEvent,
    value: Song | null,
    _reason: string,
  ) => {
    setValue(value);
    if (!value) return;
    onSelect(value);
  };

  const handleInputChange = (
    _event: React.SyntheticEvent,
    value: string,
    _reason: string,
  ) => {
    setInputValue(value);
  };

  return (
    <Autocomplete
      options={options}
      renderInput={(params) => {
        return <TextField {...params} label="Choose a Song" fullWidth />;
      }}
      filterOptions={(x) => x}
      value={value}
      inputValue={inputValue}
      onChange={handleValueChange}
      onInputChange={handleInputChange}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText="No songs"
      getOptionLabel={(option: Song) => {
        return `${option.artist} - ${option.title}`;
      }}
      getOptionKey={(option: Song) => {
        return option.songId;
      }}
    />
  );
}
