"use server";
// entire file uses server ACTIONS,
// do NOT export components in this file, only functions

import { db } from "@/db/index";
import { type Song, songs } from "@/db/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";

export async function getSong(songId: number): Promise<Song | undefined> {
  return db.query.songs.findFirst({
    where: eq(songs.songId, songId),
  });
}

export async function getSongRecommendations(songId: number): Promise<Song[]> {
  /* mock data, in future get from flask */
  return db
    .select()
    .from(songs)
    .orderBy(sql`RANDOM ()`)
    .limit(10);
}

export async function searchSongs(query: string): Promise<Song[]> {
  const words = query
    .trim()
    .split(" ")
    .filter((word) => word.length > 0);

  const conditions = words.map((word) => {
    /* Match case insensitively to either title or artist */
    return or(ilike(songs.title, `${word}%`), ilike(songs.artist, `${word}%`));
  });

  return db
    .select()
    .from(songs)
    .where(and(...conditions))
    .limit(100);
}
