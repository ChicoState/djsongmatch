"use server";
// entire file uses server ACTIONS, 
// do NOT export components in this file, only functions

import { musicData, Song } from "@/db/schema";
import { and, eq, like, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle("file:db.db");

export async function getSong(songId: number) {
    const song = db
        .select()
        .from(musicData)
        .where(
            eq(musicData.songId, Number(songId.toString()))
        ).get();

    return song;
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
