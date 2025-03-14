"use client";

import SidebarItem from "@/components/sidebar-item";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserGear, FaFileInvoice } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { logoutAction } from "@/actions/logout-action";
import { useActionState } from "react";
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";

import Image from "next/image";

export default function LayoutClient({ children, session }) {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(logoutAction, null);

  // Avatar Dicebear
  const avatar = createAvatar(glass, {
    seed: session.user.username,
  });

  const svg = avatar.toDataUri();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-[230px] bg-white shadow-md flex flex-col rounded-t-sm">
        <Link
          href="/dashboard"
          className="text-lg font-semibold mb-6 px-4 py-2"
        >
          InvoEz.
        </Link>
        <section className="space-y-4 p-2">
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
            active={pathname.startsWith("/dashboard/history")}
            href="/dashboard/history"
          />
        </section>
        <section className="space-x-4 mt-auto flex px-4 py-6 items-center ">
          <Popover showArrow offset={10} placement="bottom">
            <PopoverTrigger>
              <Image
                alt="image"
                src={session.user.avatarURL || svg}
                width={50}
                height={50}
                className="rounded-full hover:opacity-75 transition-opacity duration-300"
              />
            </PopoverTrigger>
            <PopoverContent className="space-y-2 p-2 rounded-md">
              <Link
                href={"/dashboard/profile"}
                className="font-semibold border px-3 py-1 rounded-md "
              >
                Profile
              </Link>
              <form action={formAction}>
                <Button
                  size="sm"
                  type="submit"
                  isLoading={pending}
                  color="danger"
                  radius="md"
                  variant="bordered"
                  className="font-bold"
                >
                  Logout
                </Button>
              </form>
            </PopoverContent>
          </Popover>
          <div>
            <h3 className="font-semibold">{session.user.username}</h3>
            <div className="font-thin">{session.user.organization}</div>
          </div>
        </section>
      </div>
      <div className="p-6 w-full">{children}</div>
    </div>
  );
}
