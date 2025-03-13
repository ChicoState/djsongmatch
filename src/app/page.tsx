"use client";

import "./globals.css";
import { useState } from "react";
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
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <div className="flex flex-row gap-4">
        <Slider
          marks={marks}
          onChangeComplete={(value) => {
            console.log(value);
          }}
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
    <section className="flex flex-col gap-8 grow">
      <SliderWithLabel label="Energy" />
      <SliderWithLabel label="Loudness" />
      <SliderWithLabel label="Danceability" />
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
      <div className="flex flex-col gap-6 p-6 rounded-lg border border-border md:flex-row shadow-xs">
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
