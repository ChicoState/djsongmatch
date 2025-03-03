import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { musicData } from "@/db/schema";
import "./globals.css";

import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";

const db = drizzle("file:./assets/ClassicHit.db");

async function SongsAutoComplete() {
  const songs = await db
    .select()
    .from(musicData)
    .orderBy(sql`RANDOM()`)
    .limit(10);

  const options: Option[] = songs.map((song) => {
    return {
      value: song.artist + " - " + song.title,
      label: song.artist + " - " + song.title,
      key: song.songId.toString(),
    };
  });
  return <AutoComplete options={options} emptyMessage="" />;
}

export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <h1 className="text-6xl text-foreground">DJ Song Match!</h1>
      <p className="text-2xl text-foreground">Begin by searching for a song.</p>
      <SongsAutoComplete />
    </div>
  );
}
