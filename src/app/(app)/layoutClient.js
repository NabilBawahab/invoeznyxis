"use client";

import SidebarItem from "@/components/sidebar-item";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserGear, FaFileInvoice } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@heroui/react";
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
        <Link href="/dashboard" className="mb-6 py-2 px-3">
          <Image src="/logo.jpeg" alt="Logo" width={130} height={30} />
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
              <User
                avatarProps={{
                  src: session.user.avatarURL || svg,
                }}
                description={session.user.organization}
                name={session.user.username}
                className="rounded-full hover:opacity-75 transition-opacity duration-300 cursor-pointer"
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
        </section>
      </div>
      <div className="p-6 w-full overflow-auto h-full">{children}</div>
    </div>
  );
}
