// components/Sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  NotebookPen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Notes", href: "/notes", icon: NotebookPen },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "hidden md:flex md:fixed top-0 left-0 h-screen bg-nav text-white transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="w-full flex flex-col py-4">
        {/* Logo dan tombol collapse */}
        <div className="flex items-center justify-center px-4 mb-6">
          {!collapsed && (
            <Image
              src="/Images/logo.png"
              width={100}
              height={100}
              alt="logo-erp-system"
              className="mb-2"
            />
          )}
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-all",
                  isActive && "bg-white/10 font-semibold",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white mt-auto px-4 py-2"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
    </aside>
  );
}
