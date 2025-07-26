"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Topbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(false);
  const { data: session } = useSession();

  // Konversi path jadi judul halaman
  const pageTitle =
    pathname === "/"
      ? "Dashboard"
      : pathname
          .slice(1)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/Login" });
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-nav text-white flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Judul halaman */}
      <h2 className="text-base md:text-lg font-semibold">{pageTitle}</h2>

      {/* Notifikasi dan profil */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {/* Teks profil hanya tampil di desktop */}
            <div className="md:block text-left">
              <p className="text-sm font-semibold leading-none">
                {session?.user?.name || "Pengguna"}
              </p>
              <p className="text-xs text-white/70">
                {session?.user?.email || "email@contoh.com"}
              </p>
            </div>

            <ChevronDown className="w-4 h-4" />
          </button>

          {openDropdown && (
            <div className="absolute right-0 md:w-full w-40 bg-white text-black rounded-3xl shadow-lg overflow-hidden z-20">
              <button
                onClick={handleLogout}
                className="btn-erp-none flex items-center gap-2 px-4 py-2 hover:bg-blue-200"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
