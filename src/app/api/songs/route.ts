import { drizzle } from "drizzle-orm/libsql";
import { NextRequest, NextResponse } from "next/server";
import { musicData } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle("file:./assets/ClassicHit.db");

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = Number(searchParams.get("songId"));
    if (!id) {
        return new Response("Missing songId", { status: 400 });
    }
    const song = await db.select().from(musicData).where(
        eq(musicData.songId, id)
    ).limit(1);

    return NextResponse.json(song);
}
