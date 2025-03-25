import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Camelot Keys Table
export const camelotKeys = sqliteTable("camelot_keys", {
    id: integer("id").primaryKey(),
    key: integer("key"),
    mode: integer("mode"),
    keyStr: text("key_str", { length: 10 }),
});

// Songs Table
export const songs = sqliteTable("songs", {
    songId: integer("song_id").primaryKey(),
    title: text("title", { length: 255 }),
    artist: text("artist", { length: 255 }),
    year: integer("year"),
    duration: integer("duration"),
    timeSignature: integer("time_signature"),
    camelotKeyId: integer("camelot_key_id").references(() => camelotKeys.id),
    tempo: real("tempo"),
    danceability: real("danceability"),
    energy: real("energy"),
    loudness: real("loudness"),
    loudnessDB: real("loudness_dB"),
    speechiness: real("speechiness"),
    acousticness: real("acousticness"),
    instrumentalness: real("instrumentalness"),
    liveness: real("liveness"),
    valence: real("valence"),
    popularity: integer("popularity"),
    genre: text("genre", { length: 30 }),
});

// Types
export type Song = typeof songs.$inferSelect;
export type CamelotKey = typeof camelotKeys.$inferSelect;