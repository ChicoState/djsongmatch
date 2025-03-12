import { Slider } from "@/components/ui/slider";
import "./globals.css";

function SliderWithLabel({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <Slider defaultValue={[50]} />
    </div>
  );
}

function SliderArea() {
  return (
    <div className="flex flex-col gap-12 p-8 bg-white grow-[3]">
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
