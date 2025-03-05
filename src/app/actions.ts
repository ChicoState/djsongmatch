"use server";
// entire file uses server ACTIONS, 
// do NOT export components in this file, only functions

import { musicData, Song } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle("file:./assets/ClassicHit.db");

export async function getSong(songId: number) {
    const song: Song[] = await db
        .select()
        .from(musicData)
        .where(
            eq(musicData.songId, Number(songId.toString()))
        ).limit(1);

    return song;
}
