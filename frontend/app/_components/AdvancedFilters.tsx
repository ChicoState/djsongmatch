"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { SongSlider } from "./ButtonSliderSection";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent } from "@radix-ui/react-popover";
import { PopoverTrigger } from "@/@frontend/components/ui/popover";
import { useYearFilter } from "@/lib/hooks";

/* Mock of all years from 1940 to 2025
 * TODO: Make more maintainable later */
const years = Array.from({ length: 2025 - 1940 + 1 }, (_, i) => 1940 + i);

function StartYearFilter() {
  const [popoverOpen, setPopoveropen] = useState(false);
  const { startYear, setStartYear } = useYearFilter();
  const onSelect = useCallback(
    (year: number) => {
      setStartYear(year);
      setPopoveropen(false);
    },
    [setStartYear, setPopoveropen],
  );
  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoveropen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-32">
            {startYear}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <Command>
            <CommandInput />
            <CommandList>
              {years.map((year) => {
                return (
                  <CommandItem key={year} onSelect={() => onSelect(year)}>
                    {year}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

function EndYearFilter() {
  const [popoverOpen, setPopoveropen] = useState(false);
  const { endYear, setEndYear } = useYearFilter();
  const onSelect = useCallback(
    (year: number) => {
      setEndYear(year);
      setPopoveropen(false);
    },
    [setEndYear, setPopoveropen],
  );
  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoveropen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-32">
            {endYear}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <Command>
            <CommandInput />
            <CommandList>
              {years.map((year) => {
                return (
                  <CommandItem key={year} onSelect={() => onSelect(year)}>
                    {year}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

function AdvancedFilters({ setOpen }: { setOpen: (open: boolean) => void }) {
  return (
    <section className="flex flex-col gap-8 grow">
      <Button
        variant="secondary"
        className="py-1 px-3 rounded-md cursor-pointer hover:bg-muted"
        onMouseDown={() => setOpen(false)}
      >
        Close
      </Button>

      <SongSlider
        parameter={"speechiness"}
        defaultValue={0.5}
        tooltip="Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks."
      />
      <SongSlider
        parameter={"acousticness"}
        defaultValue={0.5}
        tooltip="A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic."
      />
      <SongSlider
        parameter={"instrumentalness"}
        defaultValue={0.5}
        tooltip='Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.'
      />
      <SongSlider
        parameter={"liveness"}
        defaultValue={0.5}
        tooltip="Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live."
      />
      <SongSlider
        parameter={"valence"}
        defaultValue={0.5}
        tooltip="A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
      />
      <section className="flex gap-8 justify-center items-center">
        <div className="flex flex-col items-center">
          <h3>Min Year</h3>
          <StartYearFilter />
        </div>
        <div className="flex flex-col items-center">
          <h3>Max Year</h3>
          <EndYearFilter />
        </div>
      </section>
    </section>
  );
}

export default function AdvancedFiltersButton() {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <Button
        onMouseDown={() => setOpen(true)}
        variant={"outline"}
        className="w-full"
      >
        Advanced Filters
      </Button>
    );

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onMouseDown={() => setOpen(false)}
      />
      <div className="fixed top-1/2 left-1/2 z-50 p-6 w-full max-w-md rounded-md border shadow-md transform -translate-x-1/2 -translate-y-1/2 bg-background text-foreground border-border">
        <AdvancedFilters setOpen={setOpen} />
      </div>
    </>
  );
}
