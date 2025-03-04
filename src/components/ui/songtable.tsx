interface Song {
  title: String,
}

import { musicData } from "@/db/schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
const db = drizzle("file:./assets/ClassicHit.db");
const songs = await db
    .select()
    .from(musicData)
    .orderBy(sql`RANDOM()`)
    .limit(10);

interface SongTableProps {
  songs: Song[];
}


export default function SongTable({songs}: SongTableProps) {
    return (
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
            <tr className="bg-gray-300 border">
              <th className="p-3 text-left border border-table_border">Title</th>
              <th className="p-3 text-left border border-table_border">Artist</th>
              <th className="p-3 text-left border border-table_border">BPM</th>
              <th className="p-3 text-left border border-table_border">Key</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {/* Empty rows to show the blank table structure */}
            {Array(10).fill(0).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border border-table_border text-table_text">-</td>
                <td className="p-3 border border-table_border text-table_text">-</td>
                <td className="p-3 border border-table_border text-table_text">-</td>
                <td className="p-3 border border-table_border text-table_text">-</td>
              </tr>
            ))}
            </tbody>
          </table>
    )
}