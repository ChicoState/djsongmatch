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
  key: integer(),
  mode: integer(),
  keyStr: varchar("key_str", { length: 10 }),
});

export const songs = pgTable(
  "songs",
  {
    songId: serial("song_id").primaryKey().notNull(),
    title: varchar({ length: 255 }),
    artist: varchar({ length: 255 }),
    year: integer(),
    duration: integer(),
    timeSignature: integer("time_signature"),
    camelotKeyId: integer("camelot_key_id"),
    tempo: doublePrecision(),
    danceability: doublePrecision(),
    energy: doublePrecision(),
    loudness: doublePrecision(),
    loudnessDB: doublePrecision("loudness_dB"),
    speechiness: doublePrecision(),
    acousticness: doublePrecision(),
    instrumentalness: doublePrecision(),
    liveness: doublePrecision(),
    valence: doublePrecision(),
    popularity: integer(),
    genre: varchar({ length: 30 }),
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
export type Song = InferSelectModel<typeof songs>;
