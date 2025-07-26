import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { extractErrorMessage } from "@/helper/error";



export async function PUT(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { title, content, isPublic } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Judul dan konten diperlukan" }, { status: 400 });
    }

    const note = await db.updateNote(id, session.user.id, title, content, isPublic);
    return NextResponse.json({ message: "Catatan diperbarui", note }, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error updating note:", error);
    return NextResponse.json({ error: `Gagal memperbarui catatan: ${message}` }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.deleteNote(id, session.user.id);
    return NextResponse.json({ message: "Catatan dihapus" }, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: `Gagal menghapus catatan: ${message}` }, { status: 500 });
  }
}