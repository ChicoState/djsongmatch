"use client";

import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Song } from "@/db/ts/schema";
import { useState } from "react";

interface SliderMarkerProps {
  /**
   * @param label - The label above the slider
   * @param markValue - The value on the slider (from 0 to 1) to add a marker like "Input Song"
   *
   */
  label: string;
  markValue: number | null;
}

interface SongSliderProps {
  /**
   * @param label - The label above the slider
   * @param defaultValue - The default value of the slider
   * @param markValue - The value on the slider (from 0 to 1) to add a marker like "Input Song"
   */
  label: string;
  defaultValue: number[];
  markValue: number | null;
}

function SliderMarker({ label, markValue }: SliderMarkerProps) {
  return (
    <div className="w-full max-w-4xl">
      {/* markValue could be null, meaning an input song is not selected*/}
      {/* if no input song, don't display markers */}
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

function SongSlider({ label, defaultValue, markValue }: SongSliderProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-2">
      <SliderMarker label="Input Song" markValue={markValue} />
      <Slider
        value={value}
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
      <SongSlider
        label="Energy"
        defaultValue={[0.5]}
        markValue={inputSong && inputSong.energy ? inputSong.energy : null}
      />
      <SongSlider
        label="Loudness"
        defaultValue={[0.42]}
        markValue={inputSong && inputSong.loudness ? inputSong.loudness : null}
      />
      <SongSlider
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
