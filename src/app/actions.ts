"use server";
// entire file uses server ACTIONS, 
// do NOT export components in this file, only functions

import { musicData, Song } from "@/db/schema";
import { and, eq, like, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle("file:./assets/ClassicHit.db");

// constants for song.mode
const MINOR = 0;
const MAJOR = 1

export async function getSong(songId: number) {
    const song = db
        .select()
        .from(musicData)
        .where(
            eq(musicData.songId, Number(songId.toString()))
        ).get();

    return song;
}

export async function getSameKey(song: Song, relativeKey: boolean = true) {
    if (song.key === null || song.mode === null) return;

    let relativeQuery = relativeKey
        ? and(
            ne(musicData.mode, song.mode),

            // if song is major, go back 3 half steps to get relative minor
            // if song is minor, go forward 3 half steps to get relative major
            // mod 12 because 12 total tones
            eq(musicData.key, (song.mode === MAJOR ? song.key - 3 : song.key + 3) % 12)
        )
        : undefined; // if relativeKey=false, just ignore query

    return db
        .select()
        .from(musicData)
        .where(
            or(
                and(
                    // checks that same song and mode
                    eq(musicData.mode, song.mode),
                    eq(musicData.key, song.key)
                ),
                relativeQuery
            )
        )
        .orderBy(sql`RANDOM()`)
        .limit(10); // arbitary limit
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
