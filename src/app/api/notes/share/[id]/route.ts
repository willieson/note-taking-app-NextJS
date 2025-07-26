import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractErrorMessage } from "@/helper/error";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; // shared_note_id
    console.log("Deleting share with shared_note_id:", id);
    await db.deleteNoteShare(id);
    return NextResponse.json({ message: "Pembagian dibatalkan" }, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error) || "Unknown error";
    console.error("Error unsharing note:", message);
    return NextResponse.json({ error: `Gagal membatalkan pembagian: ${message}` }, { status: 500 });
  }
}