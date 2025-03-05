"use client";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Song } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

export default function SongAutocomplete() {
  const [value, setValue] = useState<Song | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Song[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["songList", inputValue], // only refetch when inputValue changes
    queryFn: () => {
      return "hi";
    },
    enabled: inputValue.trim() !== "", // only fetch when input has value
    staleTime: 5 * 60 * 1000, // arbitary cache lifetime of 5 min
  });

  const handleValueChange = (
    _event: React.SyntheticEvent,
    value: Song | null,
    _reason: string,
  ) => {
    setValue(value);
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
    />
  );
}
