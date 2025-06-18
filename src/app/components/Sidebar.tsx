"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  Users,
  Warehouse,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sales", href: "/Sales", icon: ShoppingCart },
  { name: "Finance", href: "/Finance", icon: DollarSign },
  { name: "HR", href: "/HR", icon: Users },
  { name: "Warehouse", href: "/Warehouse", icon: Warehouse },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block md:fixed md:top-0 md:left-0 md:h-screen md:w-64 bg-nav md:text-white py-4">
      <div className="flex justify-center">
        <Image
          src="/Images/logo.png"
          width="100"
          height="100"
          alt="logo-erp-system"
          className="mb-2"
        />
      </div>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "px-4 py-2 rounded hover:bg-white/10 transition",
              pathname === item.href && "bg-white/10 font-semibold"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
