"use client";

import "@/app/globals.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface SliderProps {
  label: string;
  defaultValue: number[];
  markValue: number;
}

function SliderWithLabel({ label, defaultValue, markValue }: SliderProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full max-w-4xl">
        {label}
        <div className="relative">
          <div
            className="absolute w-px h-5 opacity-85 -bottom-[27px] bg-muted-foreground"
            style={{ left: `${markValue}%`, transform: "translateX(-50%)" }}
          >
            <div className="absolute -top-5 left-1/2 text-sm font-medium -translate-x-1/2">
              <span className="whitespace-nowrap">Input Song</span>
            </div>
          </div>
        </div>
      </div>
      <Slider defaultValue={defaultValue} onValueChange={setValue} />
    </div>
  );
}

function SliderArea() {
  return (
    <section className="flex flex-col gap-8 grow">
      <SliderWithLabel label="Energy" defaultValue={[50]} markValue={30} />
      <SliderWithLabel label="Loudness" defaultValue={[42]} markValue={73} />
      <SliderWithLabel
        label="Danceability"
        defaultValue={[69]}
        markValue={62}
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
