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
  console.log("Handling GET request for comments of note ID:", id);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const comments = await db.getCommentsByNoteId(id);
    return NextResponse.json(comments, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error fetching comments:", message);
    return NextResponse.json({ error: `Gagal mengambil komentar: ${message}` }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("Handling POST request for comments of note ID:", id);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await req.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const newComment = await db.addComment(id, session.user.id, content);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error adding comment:", message);
    return NextResponse.json({ error: `Gagal menambahkan komentar: ${message}` }, { status: 500 });
  }
}