"use server";
// entire file uses server ACTIONS, 
// do NOT export components in this file, only functions

import { musicData, Song } from "@/db/schema";
import { and, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle("file:./assets/ClassicHit.db");

export async function getSong(songId: number) {
    const song = db
        .select()
        .from(musicData)
        .where(
            eq(musicData.songId, Number(songId.toString()))
        ).get();

    return song;
}

export async function getSameKey(key: number) {
    const sameKey = await db
        .select()
        .from(musicData)
        .where(eq(musicData.key, key))
        .orderBy(sql`RANDOM()`)
        .limit(10); // arbitary limit
    return sameKey;
}

export async function searchSongs(query: string) {
    const words = query.split(" ");
    const conditions = words.map((word) => {
        return or(
            like(musicData.title, `%${word}%`),
            like(musicData.artist, `%${word}%`)
        );
    });

    return db
        .select()
        .from(musicData)
        .where(
            and(...conditions)
        )
        .limit(100)
}
