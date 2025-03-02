"use client";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import "./globals.css";

// mock data, delete later
const options: Option[] = [
  { value: "Song 1", label: "Song 1" },
  { value: "Song 2", label: "Song 2" },
  { value: "Song 3", label: "Song 3" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <h1 className="text-6xl text-foreground">DJ Song Match!</h1>
      <p className="text-2xl text-foreground">Begin by searching for a song.</p>
      <AutoComplete options={options} emptyMessage="No songs found." />
    </div>
  );
}
