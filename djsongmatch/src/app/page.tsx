import { musicData } from "@/db/schema";
import "./globals.css";

import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
const db = drizzle("file:./assets/ClassicHit.db");

async function Songs() {
  const songs = await db.select().from(musicData);
  return (
    <div>
      <ul>
        {songs.map((song) => {
          return <li key={song.track + song.artist}>{song.track}</li>;
        })}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <h1 className="text-6xl text-white">DJ Song Match!</h1>
      <p className="text-2xl text-white">Begin by searching for a song.</p>
      <Songs />
    </div>
  );
}
