"use server";
// entire file uses server ACTIONS, 
// do NOT export components in this file, only functions

import { Song, songTable } from "@/db/ts/schema";
import { and, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle("file:./src/db/db.db");

export async function getSong(songId: number): Promise<Song | null> {
    /**
     * Returns a promise to a song with the given id
     * If the song does not exist, returns null
     */

    return db
        .select()
        .from(songTable)
        .where(
            eq(songTable.songId, songId)
        ).limit(1)
        .then((result) => result[0]);
}

export async function searchSongs(query: string): Promise<Song[]> {
    /**
     * Returns a promise to an array of songs whose title or artist
     * contains the given query
     * If no songs match, returns an empty array
     */
    const words = query.split(" ");
    const conditions = words.map((word) => {
        return or(
            like(songTable.title, `%${word}%`),
            like(songTable.artist, `%${word}%`)
        );
    });

    return db
        .select()
        .from(songTable)
        .where(
            and(...conditions)
        )
        .limit(100)
}
