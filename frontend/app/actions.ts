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

export async function getSongRecommendations(
  songId: number,
  options?: { 
    danceabilityContrast?: number, 
    energyContrast?: number, 
    loudnessContrast?: number,
    bpmPlusMinus?: number,
    startYear?: number,
    endYear?: number
    limit?: number 
  }
): Promise<Song[]> {
  try {
    const params = new URLSearchParams();
    if (options?.danceabilityContrast !== undefined) {
      params.append("danceability_contrast", options.danceabilityContrast.toString());
    }
    if (options?.energyContrast !== undefined) {
      params.append("energy_contrast", options.energyContrast.toString());
    }
    if (options?.loudnessContrast !== undefined) {
      params.append("loudness_contrast", options.loudnessContrast.toString());
    }
    if (options?.bpmPlusMinus !== undefined) {
      params.append("bpm_plus_minus", options.bpmPlusMinus.toString());
    }
    if (options?.startYear !== undefined) {
      params.append("start_year", options.startYear.toString());
    }
    if (options?.endYear !== undefined) {
      params.append("end_year", options.endYear.toString());
    }
    if (options?.limit !== undefined) {
      params.append("limit", options.limit.toString());
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/songs/${songId}/recommendations?${params.toString()}`;
    const response = await fetch(url, {
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
