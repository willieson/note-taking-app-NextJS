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
    const users = await db.getAllUsers(session.user.id); 
    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: `Gagal mengambil daftar pengguna: ${message}` }, { status: 500 });
  }
}