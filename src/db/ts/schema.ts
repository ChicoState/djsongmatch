import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core"

export const camelotKeyTable = sqliteTable("camelot_key", {
    id: integer().primaryKey().notNull(),
    key: integer().notNull(),
    mode: integer().notNull(),
    keyStr: text("key_str", { length: 32 }).notNull(),
});

export const songTable = sqliteTable("song", {
    songId: integer("song_id").primaryKey().notNull(),
    title: text({ length: 255 }).notNull(),
    artist: text({ length: 255 }).notNull(),
    year: integer().notNull(),
    camelotKey: integer("camelot_key").notNull().references(() => camelotKeyTable.id),
    duration: integer().notNull(),
    timeSignature: integer("time_signature").notNull(),
    danceability: real().notNull(),
    energy: real().notNull(),
    loudness: real().notNull(),
    loudnessDb: real("loudness_db").notNull(),
    speechiness: real().notNull(),
    acousticness: real().notNull(),
    instrumentalness: real().notNull(),
    liveness: real().notNull(),
    valence: real().notNull(),
    tempo: real().notNull(),
    popularity: integer().notNull(),
    genre: text({ length: 64 }).notNull(),
});

export type CamelotKey = InferSelectModel<typeof camelotKeyTable>;
export type Song = InferSelectModel<typeof songTable>;
