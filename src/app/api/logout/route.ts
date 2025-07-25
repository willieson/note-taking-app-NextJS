import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", { maxAge: 0, path: '/' });
  res.cookies.set("userId", "", { maxAge: 0, path: '/' });
  res.cookies.set("username", "", { maxAge: 0, path: '/' });
  return res;
}
