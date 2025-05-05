"use server";
// entire file uses server ACTIONS, 
// do NOT export components in this file, only functions

import { songs, Song } from "@/db/schema";
import { and, eq, like, or } from "drizzle-orm";
import { db } from "@/db/index";

export async function getSong(songId: number): Promise<Song | undefined> {
    return db
        .select()
        .from(songs)
        .where(
            eq(songs.songId, Number(songId.toString()))
        ).get();
}

export async function searchSongs(query: string): Promise<Song[]> {
    const words = query.split(" ");
    const conditions = words.map((word) => {
        return or(
            like(songs.title, `%${word}%`),
            like(songs.artist, `%${word}%`)
        );
    });

    return db
        .select()
        .from(songs)
        .where(
            and(...conditions)
        )
        .limit(100)
}
