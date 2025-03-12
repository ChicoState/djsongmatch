"use client";

import { Slider } from "@/components/ui/slider";
import "./globals.css";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

function SliderWithLabel({ label }: { label: string }) {
  const [value, setValue] = useState([50]);
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <div className="flex flex-row gap-4">
        <Slider defaultValue={value} onValueChange={setValue} />
        <label>{value}%</label>
        <Switch onCheckedChange={setChecked} />
      </div>
    </div>
  );
}

function SliderArea() {
  return (
    <div className="flex flex-col gap-12 p-8 rounded-lg bg-background grow-[6] border-2 border-foreground border-opacity-10">
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
