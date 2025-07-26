import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractErrorMessage } from "@/helper/error";



export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sharedNotes = await db.getSharedNotes(session.user.id); // Untuk "Shared to Me"
    return NextResponse.json(sharedNotes, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    return NextResponse.json({ error: `Gagal mengambil catatan yang dibagikan: ${message}` }, { status: 500 });
  }
}