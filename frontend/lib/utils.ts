import type { Song } from "@/db/schema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SongWithUuid extends Song {
  uuid: string;
}

export function generateSongUuid(song: Song) {
  return { ...song, uuid: crypto.randomUUID() };
}

export function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
