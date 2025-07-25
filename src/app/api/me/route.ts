// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-super-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string; // ini adalah email
    };

    return NextResponse.json({
      id: decoded.userId,
      name: decoded.username.split("@")[0], // nama dari email
      email: decoded.username,
    });
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
