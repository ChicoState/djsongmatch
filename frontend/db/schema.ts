import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core"
import { InferSelectModel } from "drizzle-orm"

export const camelotKeys = sqliteTable("camelot_keys", {
    id: integer().primaryKey().notNull(),
    key: integer(),
    mode: integer(),
    keyStr: text("key_str", { length: 10 }),
});

export const songs = sqliteTable("songs", {
    songId: integer("song_id").primaryKey().notNull(),
    title: text({ length: 255 }),
    artist: text({ length: 255 }),
    year: integer(),
    duration: integer(),
    timeSignature: integer("time_signature"),
    camelotKeyId: integer("camelot_key_id").references(() => camelotKeys.id),
    tempo: real(),
    danceability: real(),
    energy: real(),
    loudness: real(),
    loudnessDB: real("loudness_dB"),
    speechiness: real(),
    acousticness: real(),
    instrumentalness: real(),
    liveness: real(),
    valence: real(),
    popularity: integer(),
    genre: text({ length: 30 }),
});

export type CamelotKey = InferSelectModel<typeof camelotKeys>;
export type Song = InferSelectModel<typeof songs>;
