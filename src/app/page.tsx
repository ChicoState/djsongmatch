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

import ButtonSliderSection from "./_components/ButtonSliderSection";

function SearchBarSection() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState("");

  const items = [
    { label: "a", value: "a", key: crypto.randomUUID() },
    { label: "b", value: "b", key: crypto.randomUUID() },
    { label: "c", value: "c", key: crypto.randomUUID() },
    { label: "Apple", value: "Apple", key: crypto.randomUUID() },
  ];

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
          {open && (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {items.map((item) => {
                return (
                  <CommandItem
                    key={item.key}
                    onMouseDown={() => {
                      setValue(item.value);
                      setInputValue(item.value);
                    }}
                  >
                    {item.label}
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

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <ButtonSliderSection />
      <SearchBarSection />
    </main>
  );
}
