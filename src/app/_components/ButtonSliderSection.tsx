"use client";

import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Song } from "@/db/schema";
import { useEffect, useState } from "react";

interface SliderMarkerProps {
  label: string;
  markValue: number | null;
}

interface SongSliderProps {
  label: string;
  defaultValue: number[];
  markValue: number | null;
}

function SliderMarker({ label, markValue }: SliderMarkerProps) {
  /**
   * SliderMarker component displays a marker on the slider, indicating a specific point.
   * The marker is styled to match the slider's thumb.
   *
   * @param label - The label to display next to the marker (e.g. "Input Song").
   * @param markValue - The value to mark on the slider (passed to SongSlider).
   */
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
  /**
   * SongSlider component allows users to adjust a value using a slider,
   * displaying the value with the given label. The value is saved to
   * local storage, so if the user leaves and comes back, their value will persist.
   *
   * @param label - The label to display next to the slider (e.g. "Energy").
   * @param defaultValue - The initial value of the slider if no value is saved in localStorage.
   * @param markValue - A value to mark a specific point on the slider (passed to SliderMarker).
   */
  const [value, setValue] = useState([0]);

  /*
   * The fn inside `useEffect()` runs every time the component is mounted.
   * Passing `[]` as second arg ensures the fn only runs on mount and not on re-render.
   */
  useEffect(() => {
    const storageValue = window.localStorage.getItem(label);
    if (storageValue === null) setValue(defaultValue);
    else setValue([parseFloat(storageValue)]);
  }, []);

  function handleValueCommit(newValue: number[]) {
    // newValue[0] assumes we only have one Thumb on the Slider
    window.localStorage.setItem(label, newValue[0].toString());
  }

  return (
    <div className="flex flex-col gap-2">
      <SliderMarker label="Input Song" markValue={markValue} />
      <Slider
        value={value}
        onValueChange={setValue}
        onValueCommit={handleValueCommit}
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
