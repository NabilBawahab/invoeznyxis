"use client";

import SidebarItem from "@/components/sidebar-item";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserGear, FaFileInvoice } from "react-icons/fa6";
import { FaHistory, FaBars } from "react-icons/fa";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@heroui/react";
import { logoutAction } from "@/actions/logout-action";
import { useActionState, useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";

import Image from "next/image";

export default function LayoutClient({ children, session }) {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(logoutAction, null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Avatar Dicebear
  const avatar = createAvatar(glass, {
    seed: session.user.username,
  });

  const svg = avatar.toDataUri();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // jika layar kurang dari sama dengan 768px nilainya akan true
    };
    handleResize(); // value awal layar
    window.addEventListener("resize", handleResize); // Pemantauan eventlistener ketika ukuran layar berubah
    return () => window.removeEventListener("resize", handleResize); // Hapus pemantauan eventlistener supaya ga leak memorynya
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {isMobile && (
        <Button
          onPress={() => setIsSideBarOpen(!isSideBarOpen)}
          className="lg:hidden z-50 absolute top-0 left-0 bg-white/50 rounded-md backdrop-blur-m"
        >
          <FaBars size={20} />
        </Button>
      )}
      <div
        className={
          `${
            isMobile //is mobile true
              ? isSideBarOpen // aktifkan sidebarclose&open
                ? "translate-x-0 fixed top-0 left-0 h-full z-40 transition-margin-left duration-300 ease-in-out" // sidebar open
                : "-translate-x-full transition-margin-right duration-300 ease-in-out" //sidebar close
              : "translate-x-0" // jika bukan mobile
          }
      w-[230px] bg-white shadow-md flex flex-col rounded-t-sm` /* default sidebar */
        }
      >
        <Link href="/dashboard" className="py-2 px-3 w-full">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={195}
            height={45}
            className="m-auto"
          />
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
      <div
        className={`p-6 w-full overflow-auto h-full ${
          isMobile && !isSideBarOpen ? "ml-0 absolute" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
