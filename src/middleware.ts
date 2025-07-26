import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Daftar halaman publik yang bisa diakses tanpa login
const publicPages = ["/", "/Login", "/Register"];

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Ambil token autentikasi dari sesi
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Jika pengguna sudah login (token ada)
  if (token) {
    // Cek apakah pengguna mencoba mengakses halaman publik
    if (publicPages.includes(pathname)) {
      // Redirect ke /dashboard jika mencoba akses halaman publik
      return NextResponse.redirect(new URL("/dashboard", origin));
    }
    // Jika bukan halaman publik, izinkan akses
    return NextResponse.next();
  }

  // Jika pengguna belum login (token tidak ada)
  if (!token) {
    // Jika mencoba akses halaman selain publik, redirect ke /login
    if (!publicPages.includes(pathname)) {
      return NextResponse.redirect(new URL("/Login", origin));
    }
    // Jika akses halaman publik, izinkan
    return NextResponse.next();
  }
}

// Tentukan rute yang akan diproses oleh middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};