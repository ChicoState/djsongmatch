"use client";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Song } from "@/db/schema";

export default function SongAutocomplete() {
  const [options, setOptions] = useState<Song[]>([]);
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => {
        return <TextField {...params} label="Choose a Song" fullWidth />;
      }}
    />
  );
}
