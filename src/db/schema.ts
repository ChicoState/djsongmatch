import type { InferSelectModel } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const musicData = sqliteTable("music_data", {
  songId: integer("SongID").primaryKey({ autoIncrement: true }).notNull(),
  title: text("Title", { length: 255 }).notNull(),
  artist: text("Artist", { length: 255 }).notNull(),
  year: integer("Year").notNull(),
  duration: integer("Duration").notNull(),
  timeSignature: text("Time_Signature", { length: 10 }).notNull(),
  danceability: real("Danceability").notNull(),
  energy: real("Energy").notNull(),
  key: integer("Key").notNull(),
  loudness: real("Loudness").notNull(),
  mode: integer("Mode").notNull(),
  speechiness: real("Speechiness").notNull(),
  acousticness: real("Acousticness").notNull(),
  instrumentalness: real("Instrumentalness").notNull(),
  liveness: real("Liveness").notNull(),
  valence: real("Valence").notNull(),
  tempo: real("Tempo").notNull(),
  popularity: integer("Popularity").notNull(),
  genre: text("Genre", { length: 255 }).notNull(),
});

export type Song = InferSelectModel<typeof musicData>;
