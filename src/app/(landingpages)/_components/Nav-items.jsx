"use client";
import { NavbarItem } from "@heroui/react";
import Link from "next/link";
// lanjut besok buat seo friendly homepage

import { usePathname } from "next/navigation";

export const NavItems = ({ href, children }) => {
  const pathname = usePathname();

  return (
    <NavbarItem>
      <Link
        className={`hover:opacity-75 transition-opacity font-semibold ${
          pathname === href ? "text-blue-800" : "text-slate-600"
        }`}
        href={href}
      >
        {children}
      </Link>
    </NavbarItem>
  );
};
