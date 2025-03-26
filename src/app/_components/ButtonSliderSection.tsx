"use client";

import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Song } from "@/db/schema";
import { CircleHelpIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SliderMarkerProps {
  label: string;
  markValue?: number | null;
}

interface SongSliderProps {
  /**
   * @param defaultValue - The default value of the slider
   * @param label - The label above the slider
   * @param markValue - The value on the slider (from 0 to 1) to add a marker like "Input Song"
   * @param tooltip - The message to display when hovering over the tooltip
   */
  defaultValue: number[];
  label: string;
  markValue: number | null;
  tooltip?: string | null;
}

function SliderMarker({ label, markValue }: SliderMarkerProps) {
  /**
   * SliderMarker component displays a marker on the slider, indicating a specific point.
   * The marker is styled to match the slider's thumb.
   * A marker is only displayed when markValue is not null
   *
   * @param label - The label to display next to the marker (e.g. "Input Song").
   * @param markValue - The value to mark on the slider (passed to SongSlider).
   */
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

function SongSlider({
  label,
  defaultValue,
  markValue,
  tooltip = null,
}: SongSliderProps) {
  /**
   * SongSlider component allows users to adjust a value using a slider,
   * displaying the value with the given label. The value is saved to
   * localStorage, so if the user leaves and comes back, their value will persist.
   *
   * The localStorage key is `slider.<sliderLabel>`
   *
   * @param label - The label to display next to the slider (e.g. "Energy").
   * @param defaultValue - The initial value of the slider if no value is saved in localStorage.
   * @param markValue - A value to mark a specific point on the slider (passed to SliderMarker).
   * @param tooltip - A string to display when hovering over the question mark (optional)
   */
  const [value, setValue] = useState([0]);

  /*
   * The fn inside `useEffect()` runs every time the component is mounted.
   * Passing `[]` as second arg ensures the fn only runs on mount and not on re-render.
   */
  useEffect(() => {
    const storageValue = window.localStorage.getItem(`slider.${label}`);
    if (storageValue === null) {
      console.log(
        `localStorage slider.${label} was null. Using default slider value: ${defaultValue}`,
      );
      setValue(defaultValue);
    } else {
      const storageValueFloat = parseFloat(storageValue);

      if (isNaN(storageValueFloat)) {
        console.log(
          `ERROR: Could not parse slider.${label} into a float! Using default value: ${defaultValue}`,
        );
        setValue(defaultValue);
      } else {
        setValue([parseFloat(storageValue)]);
      }
    }
  }, []);

  function handleValueCommit(newValue: number[]) {
    // localStorage key is `slider.<sliderLabel>`
    window.localStorage.setItem(`slider.${label}`, newValue[0].toString());
    // newValue[0] assumes we only have one Thumb on the Slider
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
      <div className="flex overflow-hidden gap-1 items-center">
        {label}

        {/* Only show icon when tooltip !== null*/}
        {tooltip !== null && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelpIcon size={18} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent
                sideOffset={4}
                className="p-2 max-w-lg translate-y-3 w-fit text-pretty"
              >
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

function SliderArea({ inputSong }: { inputSong: Song | null }) {
  /**
   * SliderArea is a component that contains all of the Slider components on the main page
   */

  return (
    <section className="flex flex-col gap-8 grow">
      <SongSlider
        label="Energy"
        defaultValue={[0.5]}
        markValue={inputSong && inputSong.energy ? inputSong.energy : null}
        tooltip="This is a really long tooltip. Basically, we got this data from spotify, so we didn't generate the metrics ourselves. We could reference the Spotify API to understand it, tho"
      />
      <SongSlider
        label="Loudness"
        defaultValue={[0.42]}
        markValue={inputSong && inputSong.loudness ? inputSong.loudness : null}
        tooltip={null}
      />
      <SongSlider
        label="Danceability"
        defaultValue={[0.69]}
        markValue={
          inputSong && inputSong.danceability ? inputSong.danceability : null
        }
        tooltip="short"
      />
    </section>
  );
}

function ButtonArea() {
  /**
   * ButtonArea is a component that contains the two buttons on the main page
   */
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
  /**
   * ButtonSliderSection is a component that contains the SliderArea and ButtonArea components
   */
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
