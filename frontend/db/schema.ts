import { sqliteTable, AnySQLiteColumn, integer, real, text } from "drizzle-orm/sqlite-core"
import { InferSelectModel, sql } from "drizzle-orm"

export const musicData = sqliteTable("music_data", {
    songId: integer("SongID").primaryKey({ autoIncrement: true }),
    title: text("Title", { length: 255 }),
    artist: text("Artist", { length: 255 }),
    year: integer("Year"),
    duration: integer("Duration"),
    timeSignature: text("Time_Signature", { length: 10 }),
    danceability: real("Danceability"),
    energy: real("Energy"),
    key: integer("Key"),
    loudness: real("Loudness"),
    mode: integer("Mode"),
    speechiness: real("Speechiness"),
    acousticness: real("Acousticness"),
    instrumentalness: real("Instrumentalness"),
    liveness: real("Liveness"),
    valence: real("Valence"),
    tempo: real("Tempo"),
    popularity: integer("Popularity"),
    genre: text("Genre", { length: 255 }),
});

export type Song = InferSelectModel<typeof musicData>;
