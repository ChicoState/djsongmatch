"use server";
// entire file uses server ACTIONS,
// do NOT export components in this file, only functions

import { musicData } from "@/db/schema";
import { and, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle("file:./assets/ClassicHit.db");

export async function getSong(songId: number) {
  const song = db
    .select()
    .from(musicData)
    .where(eq(musicData.songId, Number(songId.toString())))
    .get();

  return song;
}

export async function searchSongs(query: string) {
  const words = query.split(" ");
  const conditions = words.map((word) => {
    return or(
      like(musicData.title, `%${word}%`),
      like(musicData.artist, `%${word}%`),
    );
  });

  return db
    .select()
    .from(musicData)
    .where(and(...conditions))
    .limit(100);
}

/*
 * In the future, this will define how the response from flask should look like (JSON)
 */
interface getRecommendedSongsResponse {
  message: string;
}

export async function getRecommendedSongs(
  songId: number,
): Promise<getRecommendedSongsResponse> {
  // what to give to flask
  const flaskParams = {
    songId: songId.toString(),
  };

  // url to flask server
  const flaskUrl = new URL("http://127.0.0.1:5001");
  flaskUrl.search = new URLSearchParams(flaskParams).toString();

  console.log(flaskUrl);
  console.log(`Fetching recommendations for songId: ${songId} from flask!`);
  try {
    const response = await fetch(flaskUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    throw new Error(
      "Error fetching recommendations. Is the flask server running?",
    );
  }
}
