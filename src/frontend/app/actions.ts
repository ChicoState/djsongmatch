"use server";
// entire file uses server ACTIONS, 
// do NOT export components in this file, only functions

import { camelotKeys, CamelotKey, songs, Song } from "@/lib/db/schema";
import { and, eq, like, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({ url: "file:./assets/ClassicHit.db" });
const db = drizzle(client); // Use the client directly as the database instance

// constants for song.mode
const MINOR = 0;
const MAJOR = 1

export async function getSong(songId: number) {
    const song = await db
        .select()
        .from(songs)
        .where(
            eq(songs.songId, Number(songId.toString()))
        ).get();

    return song;
}

// export async function getSameKey(song: Song, relativeKey: boolean = true) {
//     if (song.camelotKeyId === null) return;

//     let relativeQuery = relativeKey
//         ? and(
//             ne(musicData.mode, song.mode),

//             // if song is major, go back 3 half steps to get relative minor
//             // if song is minor, go forward 3 half steps to get relative major
//             // mod 12 because 12 total tones
//             eq(musicData.key, (song.mode === MAJOR ? song.key - 3 : song.key + 3) % 12)
//         )
//         : undefined; // if relativeKey=false, just ignore query

//     return db
//         .select()
//         .from(musicData)
//         .where(
//             or(
//                 and(
//                     // checks that same song and mode
//                     eq(musicData.mode, song.mode),
//                     eq(musicData.key, song.key)
//                 ),
//                 relativeQuery
//             )
//         )
//         .orderBy(sql`RANDOM()`)
//         .limit(10); // arbitary limit
// }

export async function searchSongs(query: string) {
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
