"use client";

import { Slider } from "@/components/ui/slider";
import "./globals.css";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

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
    <div className="flex flex-col gap-12 p-8 rounded-lg bg-background grow-[3]">
      <SliderWithLabel label="Energy" />
      <SliderWithLabel label="Loudness" />
      <SliderWithLabel label="Danceability" />
    </div>
  );
}

function ButtonArea() {
  return <div className="bg-green-300 grow-[1]">hi</div>;
}

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <div className="flex gap-4 p-4 w-full bg-red-300">
        <SliderArea />
        <ButtonArea />
      </div>
    </main>
  );
}
