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
import { CircleHelpIcon } from "lucide-react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useState } from "react";
import { useSelectedSong } from "@/lib/hooks";

/* All possible parameters for recommendation algorithm */
export type Parameter = "Danceability" | "Energy" | "Loudness";

function SliderMarker({
  label,
  markValue,
}: {
  label: string;
  markValue?: number | null;
}) {
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
  parameter,
  label,
  defaultValue,
  markValue,
  tooltip = null,
}: {
  parameter: Parameter;
  label?: string;
  defaultValue: number;
  markValue: number | undefined;
  tooltip?: string | null;
}) {
  /* If label is null or undefined, use the parameter as the label */
  label = label ? label : parameter;

  /* localStorage key is `slider.<sliderLabel>` */
  const [sliderValue, setSliderValue] = useLocalStorage(
    `slider.${parameter}`,
    defaultValue.toString(),
  );

  const [value, setValue] = useState(Number.parseFloat(sliderValue));

  function handleValueCommit(newValue: number[]) {
    /* newValue[0] assumes we only have one Thumb on the Slider */
    setSliderValue(newValue[0].toString());
  }

  return (
    <div className="flex flex-col gap-2">
      <SliderMarker label="Input Song" markValue={markValue} />
      <Slider
        value={[value]}
        onValueChange={(value) => setValue(value[0])}
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

function SliderArea() {
  /**
   * SliderArea is a component that contains all of the Slider components on the main page
   */
  const { selectedSong } = useSelectedSong();

  if (selectedSong == undefined) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-8 grow">
      <SongSlider
        parameter="Energy"
        defaultValue={0.5}
        markValue={selectedSong.energy}
        tooltip="This is a really long tooltip. Basically, we got this data from spotify, so we didn't generate the metrics ourselves. We could reference the Spotify API to understand it, tho"
      />
      <SongSlider
        parameter="Loudness"
        defaultValue={0.42}
        markValue={selectedSong.loudness}
        tooltip={null}
      />
      <SongSlider
        parameter="Danceability"
        defaultValue={0.69}
        markValue={selectedSong.danceability}
        tooltip="short"
      />
    </section>
  );
}

/**
 * ButtonArea is a component that contains the two buttons on the main page
 */
function ButtonArea() {
  return (
    <section className="flex flex-col gap-4 justify-center items-center min-w-[150px]">
      <Button variant={"outline"} className="w-full">
        Advanced Filters
      </Button>
      <Button
        className="w-full cursor-pointer"
        onMouseDown={() =>
          /* Hacky way to trigger the refetch.
           * Used in the RecommendationTable component.
           */
          window.dispatchEvent(new Event("generateButtonClicked"))
        }
      >
        Generate
      </Button>
    </section>
  );
}

function ButtonSliderSection() {
  return (
    <section className="pt-8 w-full max-w-4xl">
      <div className="flex flex-col gap-6 p-8 rounded-lg border md:flex-row border-border shadow-xs">
        <SliderArea />
        <ButtonArea />
      </div>
    </section>
  );
}

export default ButtonSliderSection;
