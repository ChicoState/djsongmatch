"use server";
// entire file uses server ACTIONS,
// do NOT export components in this file, only functions

import { db } from "@/db/index";
import { type Song, songs } from "@/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";

export async function getSong(songId: number): Promise<Song | undefined> {
  return db.query.songs.findFirst({
    where: eq(songs.songId, songId),
  });
}

export async function getSongRecommendations(songId: number): Promise<Song[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/songs/${songId}/recommendations`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching song recommendations:", error);
    return [];
  }
}

export async function searchSongs(query: string): Promise<Song[]> {
  const words = query.split(" ");

  const conditions = words.map((word) => {
    /* Match case insensitively to either title or artist */
    return or(
      ilike(songs.title, `%${word}%`),
      ilike(songs.artist, `%${word}%`),
    );
  });

  return db
    .select()
    .from(songs)
    .where(and(...conditions))
    .limit(100);
}
