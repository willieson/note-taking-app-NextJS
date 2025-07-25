import { NextResponse } from "next/server";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Ambil user dari database berdasarkan email
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Cek apakah password cocok dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid Password" }, { status: 401 });
    }

    // Buat JWT token
    const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-super-secret-key';
    interface UserPayload extends JwtPayload {
      userId: string;
      username: string;
    }

    // Signing a token
    const payload: UserPayload = {
      userId: user.id,
      username: user.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expires in 1 hour
    };

    const token = jwt.sign(payload, JWT_SECRET);
    console.log('Generated Token:', token);

    // Verifikasi token untuk memastikan token valid
    let decoded: UserPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      console.log('Decoded Token:', decoded);
      console.log('User ID:', decoded.userId);
      console.log('Username:', decoded.username);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ message: "Failed to generate valid token" }, { status: 500 });
    }

    // Siapkan respons
    const res = NextResponse.json({
      message: "Login successful",
      userId: decoded.userId,
      username: decoded.username,
      token,
    }, { status: 200 });

    // Simpan data di cookies (sebagai pengganti sesi sederhana)
    res.cookies.set('token', token, {
      httpOnly: true, // Cegah akses dari JavaScript untuk keamanan
      secure: process.env.NODE_ENV === 'production', // Hanya HTTPS di produksi
      maxAge: 60 * 60, // 1 jam (sesuaikan dengan exp token)
      path: '/',
    });
    res.cookies.set('userId', decoded.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
    });
    res.cookies.set('username', decoded.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
    });

    return res;

  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}