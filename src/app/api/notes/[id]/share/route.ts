import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = parseInt(params.id);
    const { emails } = await req.json(); // Expecting { emails: string[] }

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 });
    }

    // Ambil user_id dari email
    const query = `
      SELECT id, email FROM users WHERE email = ANY($1)
    `;
    const result = await db.query(query, [emails]);

    const usersToShare = result.rows; // array of { id, email }

    if (usersToShare.length === 0) {
      return NextResponse.json({ error: "No valid users found" }, { status: 404 });
    }

    // Insert into note_shares
    const insertPromises = usersToShare.map((user) =>
      db.query(
        `
       INSERT INTO note_shares (note_id, shared_to_id, created_at)
VALUES ($1, $2, NOW())
ON CONFLICT DO NOTHING

        `,
        [noteId, user.id]
      )
    );

    await Promise.all(insertPromises);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Share error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
