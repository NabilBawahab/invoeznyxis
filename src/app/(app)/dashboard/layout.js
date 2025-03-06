"use client";

import SidebarItem from "@/components/sidebar-item";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserGear, FaFileInvoice } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { Button } from "@heroui/react";
import { useActionState } from "react";
import { logoutAction } from "../../(auth)/_actions/action";

export default function Layout({ children }) {
  const pathname = usePathname();
  const [_, formAction, pending] = useActionState(logoutAction, null);
  return (
    <div className="flex h-screen bg-gray-50 ">
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
        <form action={formAction} className="p-4 mt-auto">
          <Button
            type="submit"
            variant="solid"
            color="danger"
            fullWidth
            className="font-semibold"
          >
            Log out
          </Button>
        </form>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
