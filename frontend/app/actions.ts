"use server";
// entire file uses server ACTIONS,
// do NOT export components in this file, only functions

import { db } from "@/db/index";
import { type Song, songs } from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";

export async function getSong(songId: number): Promise<Song | undefined> {
  return db.query.songs.findFirst({
    where: eq(songs.songId, songId),
  });
}

export async function searchSongs(query: string): Promise<Song[]> {
  query = query.trim();
  const words = query.split(" ");

  /*
   * In postgres tsquery, "word:*" means find anything that starts with word
   * For example: "campfi:*" would find anything that starts with "campfi"
   */
  const prefixQueryParts = words.map((word) => `${word}:*`);

  /* Make it so that the search matches any of the words the user typed*/
  const prefixQuery = prefixQueryParts.join(" | ");

  return db
    .select()
    .from(songs)
    .where(
      or(
        sql`to_tsvector('english', ${songs.title}) @@ to_tsquery('english', ${prefixQuery})`,
        sql`to_tsvector('english', ${songs.artist}) @@ to_tsquery('english', ${prefixQuery})`,
      ),
    )
    .limit(100);
}
