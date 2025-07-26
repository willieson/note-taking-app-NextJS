import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractErrorMessage } from "@/helper/error";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("Handling GET request for note ID:", id);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const note = await db.getNoteById(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error fetching note:", message);
    return NextResponse.json({ error: `Gagal mengambil catatan: ${message}` }, { status: 500 });
  }
}