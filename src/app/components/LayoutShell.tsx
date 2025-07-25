"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";
import clsx from "clsx";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  // Ambil sidebar setting dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    } else {
      setCollapsed(false); // default expand
    }
  }, []);

  // Simpan perubahan collapse ke localStorage
  useEffect(() => {
    if (collapsed !== null) {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
  }, [collapsed]);

  // Cek autentikasi
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/Login");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsAuthenticated(false);
        router.push("/Login");
      }
    };

    checkAuth();
  }, [router]);

  // ⏳ Jangan render apa-apa sebelum tahu status auth dan sidebar
  if (collapsed === null || isAuthenticated === null) return null;

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={clsx(
          "flex flex-col w-full min-h-screen transition-all duration-300",
          collapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        <Topbar />
        <main className="flex-1 p-6 bg-box">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
