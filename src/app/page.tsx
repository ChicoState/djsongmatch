"use client";

import "./globals.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SliderProps {
  label: string;
  defaultValue: number;
  markValue: number;
}

function SliderWithLabel({ label, defaultValue = 50, markValue }: SliderProps) {
  // do NOT ask me how this works
  // only god knows
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full max-w-4xl">
        {label}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number.parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
          />

          <div
            className="absolute w-px h-5 opacity-70 bottom-[0.5] bg-muted-foreground"
            style={{ left: `${markValue}%`, transform: "translateX(-50%)" }}
          >
            <div className="absolute -top-6 left-1/2 text-sm font-medium -translate-x-1/2">
              <span className="whitespace-nowrap">Input Song</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderArea() {
  return (
    <section className="flex flex-col gap-8 grow">
      <SliderWithLabel label="Energy" defaultValue={50} markValue={30} />
      <SliderWithLabel label="Loudness" defaultValue={42} markValue={73} />
      <SliderWithLabel label="Danceability" defaultValue={69} markValue={62} />
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

function MiddleSection() {
  return (
    <div className="p-8 w-full max-w-4xl">
      <div className="flex flex-col gap-6 p-6 rounded-lg border md:flex-row border-border shadow-xs">
        <SliderArea />
        <ButtonArea />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <MiddleSection />
    </main>
  );
}
