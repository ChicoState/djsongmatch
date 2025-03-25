import { relations } from "drizzle-orm/relations";
import { camelotKey, song } from "./schema";

export const songRelations = relations(song, ({ one }) => ({
    camelotKey: one(camelotKey, {
        fields: [song.camelotKey],
        references: [camelotKey.id]
    }),
}));

export const camelotKeyRelations = relations(camelotKey, ({ many }) => ({
    songs: many(song),
}));
