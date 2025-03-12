"use client";

import "./globals.css";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

function SliderWithLabel({ label }: { label: string }) {
  const [value, setValue] = useState([50]);
  const [checked, setChecked] = useState(false);
  const marks = {
    30: {
      label: "Old Song",
    },
  };
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <div className="flex flex-row gap-4">
        <Slider
          marks={marks}
          dotStyle={{
            scale: 2,
            height: "8pt",
            width: "1px",
          }}
        />
      </div>
    </div>
  );
}

function SliderArea() {
  return (
    <div className="flex flex-col gap-12 p-8 rounded-lg border-2 border-opacity-10 bg-background grow-[6] border-foreground">
      <SliderWithLabel label="Energy" />
      <SliderWithLabel label="Loudness" />
      <SliderWithLabel label="Danceability" />
    </div>
  );
}

function ButtonArea() {
  return (
    <div className="flex flex-col gap-4 justify-evenly items-center p-4 grow-[1]">
      <Button className="py-8 px-16 w-1/4" variant={"outline"}>
        Advanced Filters
      </Button>
      <Button className="py-8 px-16 w-1/4">Generate</Button>
    </div>
  );
}

function MiddleSection() {
  return (
    <>
      <div className="flex py-8 px-36 w-full">
        <SliderArea />
        <ButtonArea />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <MiddleSection />
    </main>
  );
}
