"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";
import clsx from "clsx";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<boolean | null>(null); // null artinya "belum tahu"

  // Ambil nilai dari localStorage hanya di client
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    } else {
      setCollapsed(false); // default expand
    }
  }, []);

  // Simpan ke localStorage setiap kali collapsed berubah
  useEffect(() => {
    if (collapsed !== null) {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
  }, [collapsed]);

  // ⏳ Jangan render apa pun sebelum tahu state-nya
  if (collapsed === null) return null;

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
