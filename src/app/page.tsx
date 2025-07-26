"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect jika belum login dan status sudah 'unauthenticated'
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }
  <div
    style={{
      maxWidth: "800px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #eee",
      borderRadius: "8px",
    }}
  >
    <h1>Selamat Datang!</h1>

    {session ? (
      <div>
        <p>Anda login sebagai: {session.user?.email}</p>
        <p>ID Pengguna: {session.user?.id}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })} // Redirect ke halaman login setelah logout
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    ) : (
      <div>
        <p>Anda belum login.</p>
        <Link
          href="/auth/login"
          style={{
            marginRight: "10px",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Register
        </Link>
      </div>
    )}
  </div>;
  redirect("/dashboard");
}
