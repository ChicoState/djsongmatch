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
      {/* Left side content */}
      <div className="flex flex-col gap-4 grow-[1]">
        <p className="text-2xl text-center text-foreground">
          Search for a song!
        </p>
        <SongsAutoComplete />
        <button className="self-center p-4 w-24 bg-green-200">Generate</button>
      </div>
      {/* Right side content */}
      <div className="h-full grow-[4]">
        <table className="w-full border-collapse border border-gray-500">
          {/* Table column width */}
          <colgroup>
              <col className="w-6/12" />{/* Title: 5/12 of space */}
              <col className="w-4/12" />{/* Artist: 4/12 of space */}
              <col className="w-1/12" />{/* BPM: 1/12 of space */}
              <col className="w-1/12" />{/* Key: 2/12 of space */}
          </colgroup>
          {/* Table header */}
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border">Title</th>
              <th className="p-3 text-left border">Artist</th>
              <th className="p-3 text-left border">BPM</th>
              <th className="p-3 text-left border">Key</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {/* Empty rows to show the blank table structure */}
            {Array(10).fill(0).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border text-gray-300">-</td>
                <td className="p-3 border text-gray-300">-</td>
                <td className="p-3 border text-gray-300">-</td>
                <td className="p-3 border text-gray-300">-</td>
              </tr>
            ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}
