import { drizzle } from "drizzle-orm/libsql";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import SongTable from "@/components/ui/songtable";

const db = drizzle("file:./assets/ClassicHit.db");

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = Number(searchParams.get("songId"));
    if (!id) {
        return new Response("Missing songId", { status: 400 });
    }
    const song = await db.select().from(SongTable).where(
        eq(SongTable.songId, id)
    ).limit(1);

    return NextResponse.json(song);
}
