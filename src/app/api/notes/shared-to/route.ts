import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractErrorMessage } from "@/helper/error";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");
    const userId = searchParams.get("userId");

    if (!noteId || !userId) {
      return NextResponse.json({ error: "Note ID dan User ID diperlukan" }, { status: 400 });
    }

    const sharedNotes = await db.getSharedNotesTo(userId, noteId);
    console.log("Shared Notes To from DB:", sharedNotes);
    return NextResponse.json(sharedNotes, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error fetching shared notes to:", message);
    return NextResponse.json({ error: `Gagal mengambil catatan yang dibagikan oleh pengguna: ${message}` }, { status: 500 });
  }
}