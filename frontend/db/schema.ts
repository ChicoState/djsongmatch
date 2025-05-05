import type { InferSelectModel } from "drizzle-orm";
import {
  doublePrecision,
  foreignKey,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const camelotKeys = pgTable("camelot_keys", {
  id: serial().primaryKey().notNull(),
  key: integer().notNull(),
  mode: integer().notNull(),
  keyStr: varchar("key_str", { length: 10 }).notNull(),
});

export const songs = pgTable(
  "songs",
  {
    songId: serial("song_id").primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    artist: varchar({ length: 255 }).notNull(),
    year: integer().notNull(),
    duration: integer().notNull(),
    timeSignature: integer("time_signature").notNull(),
    camelotKeyId: integer("camelot_key_id").notNull(),
    tempo: doublePrecision().notNull(),
    danceability: doublePrecision().notNull(),
    energy: doublePrecision().notNull(),
    loudness: doublePrecision().notNull(),
    loudnessDB: doublePrecision("loudness_dB").notNull(),
    speechiness: doublePrecision().notNull(),
    acousticness: doublePrecision().notNull(),
    instrumentalness: doublePrecision().notNull(),
    liveness: doublePrecision().notNull(),
    valence: doublePrecision().notNull(),
    popularity: integer().notNull(),
    genre: varchar({ length: 30 }).notNull(),
    cluster: integer() // leave as an optional value
  },
  (table) => [
    foreignKey({
      columns: [table.camelotKeyId],
      foreignColumns: [camelotKeys.id],
      name: "songs_camelot_key_id_fkey",
    }),
  ],
);

export type CamelotKey = InferSelectModel<typeof camelotKeys>;
export type Song = InferSelectModel<typeof songs> & {
  compatibilityType?: string; // Optional field for compatibility type from the backend
  camelotKeyStr?: string; // Optional field for the key string from the backend
};
