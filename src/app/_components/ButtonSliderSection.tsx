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
import { useState } from "react";

interface SliderMarkerProps {
  /**
   * @param label - The label above the slider
   * @param markValue - The value on the slider (from 0 to 1) to add a marker like "Input Song"
   *
   */
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
   * SliderMarker is a component that displays a marker on the slider.
   * - A marker is a visual indicator that renders a "tick" and a label above the slider.
   * - The marker is only displayed when markValue is not null.
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
   * SongSlider is a component that displays a slider with a label and a tooltip.
   * - The slider is used to adjust the value of the song metric
   * - The label is displayed above the slider.
   * - The tooltip is displayed when the user hovers over the slider.
   */

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
      <div className="flex overflow-hidden gap-1 items-center">
        {label}

        {/* Only show icon when tooltip !== null*/}
        {tooltip !== null && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelpIcon size={18} />
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
