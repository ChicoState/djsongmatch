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

interface FlaskParams {
  danceability?: number;
  energy?: number;
  loudness?: number;
  start_year?: number;
  end_year?: number;
  tempo_range?: number;
  limit?: number;
}

export async function getSongRecommendations(
  songId: number,
  params: FlaskParams,
): Promise<Song[]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/api/songs/${songId}/recommendations`,
  );
  /**
   * Request a list of recommended songs from Flask backend.
   * Assumes that backend will know what to do if certain parameters are not provided.
   */

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, value.toString());
    }
  }
  url.search = searchParams.toString();

  /* We don't need to await here because
   * useQuery() on client will handle loading,
   * errors, etc. */

  console.log(`Attempting to fetch from backend: ${url.toString()}`);
  return fetch(url, {
    method: "GET",
  }).then((resp) => resp.json());
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
