// src/app/admin/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  ClipboardList,
  MessageCircle,
  LogOut,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Dashboard",
      href: "/app/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Manajemen Tiket",
      href: "/app/admin/tiket-management",
      icon: <Ticket size={18} />,
    },
    {
      name: "Manajemen Pemesanan",
      href: "/app/admin/pemesanan",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Manajemen Ulasan",
      href: "/app/admin/ulasan",
      icon: <MessageCircle size={18} />,
    },
  ];

  const handleLogout = () => {
    // Contoh logout: hapus token dan redirect
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-blue-700 text-white p-6 shadow-lg">
        <div className="text-2xl font-bold mb-8">✈️ TripMate Admin</div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? "bg-white text-blue-700 font-semibold"
                  : "hover:bg-blue-600"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}
