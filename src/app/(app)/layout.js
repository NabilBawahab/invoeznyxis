"use client";

import SidebarItem from "@/components/sidebar-item";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserGear, FaFileInvoice } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";

export default function Layout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-[230px] bg-white shadow-md flex flex-col rounded-t-sm">
        <Link
          href="/dashboard"
          className="text-lg font-semibold mb-6 px-4 py-2"
        >
          InvoEz.
        </Link>
        <section className="space-y-4">
          <SidebarItem
            icon={<FaUserGear />}
            text="Profile"
            active={pathname === "/dashboard/profile"}
            href="/dashboard/profile"
          />
          <SidebarItem
            icon={<FaFileInvoice />}
            text="Create Invoice"
            active={pathname === "/dashboard/create"}
            href="/dashboard/create"
          />
          <SidebarItem
            icon={<FaHistory />}
            text="History"
            active={pathname === "/dashboard/history"}
            href="/dashboard/history"
          />
        </section>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
