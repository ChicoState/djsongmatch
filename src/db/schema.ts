import { sqliteTable, AnySQLiteColumn, integer, real, text } from "drizzle-orm/sqlite-core"
import { InferSelectModel, sql } from "drizzle-orm"

export const musicData = sqliteTable("music_data", {
    songId: integer("Song_ID").primaryKey({ autoIncrement: true }),
    title: text("Title", { length: 255 }),
    artist: text("Artist", { length: 255 }),
    year: integer("Year"),
    duration: integer("Duration"),
    timeSignature: text("Time_Signature", { length: 10 }),
    key: integer("Key"),
    mode: integer("Mode"),
    keyString: text("Key_String", { length: 10 }),
    camelotKey: integer("Camelot_Key"),
    tempo: real("Tempo"),
    danceability: real("Danceability"),
    energy: real("Energy"),
    loudness: real("Loudness"),
    loudnessDB: real("Loudness_dB"),
    speechiness: real("Speechiness"),
    acousticness: real("Acousticness"),
    instrumentalness: real("Instrumentalness"),
    liveness: real("Liveness"),
    valence: real("Valence"),
    popularity: integer("Popularity"),
    genre: text("Genre", { length: 255 }),
});

export type Song = InferSelectModel<typeof musicData>;
