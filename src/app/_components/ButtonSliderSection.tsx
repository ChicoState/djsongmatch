"use client";

import "@/app/globals.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Song } from "@/db/schema";

interface SliderProps {
  label: string;
  defaultValue: number[];
  markValue: number | null;
}

function SliderMarker({
  label,
  markValue,
}: {
  label: string;
  markValue: number | null;
}) {
  return (
    <div className="w-full max-w-4xl">
      {markValue != null && (
        <div className="relative">
          <div
            className="absolute w-px h-5 transition-all duration-300 ease-in-out animate-in opacity-85 bg-muted-foreground"
            style={{
              left: `${markValue * 100}%`,
              transform: "translateX(-50%) translateY(10%)",
            }}
          >
            <div className="absolute -top-5 left-1/2 text-sm font-medium -translate-x-1/2">
              <span className="whitespace-nowrap">{label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SliderWithLabel({ label, defaultValue, markValue }: SliderProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      <SliderMarker label="Input Song" markValue={markValue} />
      <Slider
        defaultValue={defaultValue}
        onValueChange={setValue}
        min={0}
        max={1}
        step={0.01}
      />
      {label}
    </div>
  );
}

function SliderArea({ inputSong }: { inputSong: Song | null }) {
  return (
    <section className="flex flex-col gap-8 grow">
      <SliderWithLabel
        label="Energy"
        defaultValue={[0.5]}
        markValue={inputSong && inputSong.energy ? inputSong.energy : null}
      />
      <SliderWithLabel
        label="Loudness"
        defaultValue={[0.42]}
        markValue={
          inputSong && inputSong.loudness
            ? // temp solution until data gets normalized
              (inputSong.loudness + 47.359) / 48.278
            : null
        }
      />
      <SliderWithLabel
        label="Danceability"
        defaultValue={[0.69]}
        markValue={
          inputSong && inputSong.danceability ? inputSong.danceability : null
        }
      />
    </section>
  );
}

function ButtonArea() {
  return (
    <section className="flex flex-col gap-4 justify-center items-center min-w-[150px]">
      <Button variant={"outline"} className="w-full">
        Advanced Filters
      </Button>
      <Button className="w-full">Generate</Button>
    </section>
  );
}

function ButtonSliderSection({ inputSong }: { inputSong: Song | null }) {
  return (
    <section className="pt-8 w-full max-w-4xl">
      <div className="flex flex-col gap-6 p-8 rounded-lg border md:flex-row border-border shadow-xs">
        <SliderArea inputSong={inputSong} />
        <ButtonArea />
      </div>
    </section>
  );
}

export default ButtonSliderSection;
