import { Song } from "@/db/schema";
import "dotenv/config";

interface SongTableProps {
  songs: Song[];
}

export default function SongTable({ songs }: SongTableProps) {
  return (
    <table className="w-full border border-gray-500 border-collapse">
      {/* Table column width */}
      <colgroup>
        <col className="w-6/12" />
        {/* Title: 5/12 of space */}
        <col className="w-4/12" />
        {/* Artist: 4/12 of space */}
        <col className="w-1/12" />
        {/* BPM: 1/12 of space */}
        <col className="w-1/12" />
        {/* Key: 2/12 of space */}
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
        {songs.map((song, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="p-3 border border-table_border text-table_text">
              {song.title}
            </td>
            <td className="p-3 border border-table_border text-table_text">
              {song.artist}
            </td>
            <td className="p-3 border border-table_border text-table_text">
              {song.tempo && Math.round(song.tempo)}
            </td>
            <td className="p-3 border border-table_border text-table_text">
              {song.key}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
