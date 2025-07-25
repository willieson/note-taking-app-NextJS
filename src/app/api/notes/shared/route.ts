import { NextResponse } from "next/server";
import { Pool } from "pg";
import { cookies } from "next/headers";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const userIdString = cookies().get("userId")?.value;
  const userId = parseInt(userIdString || "", 10);

  if (!userId || isNaN(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `
    SELECT 
  notes.id,
  notes.title,
  notes.content,
  notes.is_public,
  users.name AS shared_by_name
FROM notes
JOIN note_shares ON notes.id = note_shares.note_id
JOIN users ON notes.user_id = users.id
WHERE note_shares.shared_to_id = $1
ORDER BY notes.created_at DESC

      `,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Gagal ambil catatan Sharing:", error);
    return NextResponse.json(
      { error: "Gagal ambil catatan Sharing" },
      { status: 500 }
    );
  }
}
