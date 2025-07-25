"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useToast } from "./ToastProvider";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const pageTitle =
    pathname === "/"
      ? "Dashboard"
      : pathname
          .slice(1)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        showToast("Berhasil logout", "success");
        setOpenDropdown(false);
        setTimeout(() => {
          router.push("/Login");
        }, 1000);
      } else {
        showToast("Gagal logout", "error");
      }
    } catch (err) {
      showToast("Server error saat logout", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.name, email: data.email });
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-nav text-white flex items-center justify-between px-4 md:px-6 shadow-sm">
      <h2 className="text-base md:text-lg font-semibold">{pageTitle}</h2>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold leading-none">
                {user ? user.name : "Memuat..."}
              </p>
              <p className="text-xs text-white/70">{user ? user.email : ""}</p>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {openDropdown && (
            <div className="absolute right-0 md:w-full w-40 bg-white text-black rounded-3xl shadow-lg overflow-hidden z-20">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="btn-erp-none flex items-center gap-2 px-4 py-2 hover:bg-blue-200 w-full text-left disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                {loading ? "Logging out..." : "Log out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
