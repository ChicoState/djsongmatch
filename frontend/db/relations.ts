import { relations } from "drizzle-orm/relations";
import { camelotKeys, songs } from "./schema";

export const songsRelations = relations(songs, ({one}) => ({
	camelotKey: one(camelotKeys, {
		fields: [songs.camelotKeyId],
		references: [camelotKeys.id]
	}),
}));

export const camelotKeysRelations = relations(camelotKeys, ({many}) => ({
	songs: many(songs),
}));