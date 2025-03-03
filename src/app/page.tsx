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
    <div className="flex flex-row gap-24 h-full">
      <div className="flex flex-col gap-4 grow-[1]">
        <p className="text-2xl text-center text-foreground">
          Search for a song!
        </p>
        <SongsAutoComplete />
        <button className="self-center p-4 w-24 bg-green-200">Generate</button>
      </div>
      <p className="h-full bg-red-50 grow-[4]">Table goes here</p>
    </div>
  );
}
