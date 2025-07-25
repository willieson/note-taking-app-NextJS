"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, NotebookPen } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Notes", href: "/notes", icon: NotebookPen },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-nav text-white border-t border-white/10 flex justify-around items-center md:hidden  z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "flex flex-col items-center text-xs",
              isActive ? "text-white font-semibold" : "text-white/60"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
