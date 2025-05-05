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

      <SongSlider parameter={"speechiness"} defaultValue={0.5} />
      <SongSlider parameter={"acousticness"} defaultValue={0.5} />
      <SongSlider parameter={"instrumentalness"} defaultValue={0.5} />
      <SongSlider parameter={"liveness"} defaultValue={0.5} />
      <SongSlider parameter={"valence"} defaultValue={0.5} />
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
