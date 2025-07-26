import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractErrorMessage } from "@/helper/error";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { noteId, sharedToUserIds } = await req.json();
    if (!noteId || !sharedToUserIds || !Array.isArray(sharedToUserIds)) {
      return NextResponse.json({ error: "Note ID dan daftar pengguna diperlukan" }, { status: 400 });
    }

    const sharedNotes = await Promise.all(
      sharedToUserIds.map((userId: string) =>
        db.shareNote(noteId, userId)
      )
    );
    return NextResponse.json({ message: "Catatan dibagikan", sharedNotes }, { status: 201 });
  }catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error sharing note:", error);
    return NextResponse.json({ error: `Gagal membagikan catatan: ${message}` }, { status: 500 });
  }
}



export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sharedNotes = await db.getSharedNotes(session.user.id);
    return NextResponse.json(sharedNotes, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error fetching shared notes:", error);
    return NextResponse.json({ error: `Gagal mengambil catatan yang dibagikan: ${message}` }, { status: 500 });
  }
}