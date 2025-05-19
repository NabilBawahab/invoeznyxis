import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { UserPopover } from "../../../components/userpopover";
import { NavItems } from "./Nav-items";

export const HomepageHeaders = ({ session }) => {
  return (
    <Navbar>
      <NavbarBrand>
        <Image
          src="/logoinvoez.png"
          width={140}
          height={140}
          alt="invoezlogo"
        />
      </NavbarBrand>
      <NavbarContent className="flex gap-4" justify="center">
        {session ? (
          <>
            <NavItems href="/">Home</NavItems>
            <NavItems href="/dashboard">Dashboard</NavItems>
            <NavItems href="/about">About</NavItems>
          </>
        ) : (
          <>
            <NavItems href="/">Home</NavItems>
            <NavItems href="/about">About</NavItems>
          </>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        {session ? (
          <NavbarItem>
            <UserPopover session={session} />
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="flex">
              <Button
                as={Link}
                size="sm"
                href="/login"
                variant="ghost"
                className="font-bold text-slate-700 font-mono"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                size="sm"
                color="primary"
                href="/register"
                variant="ghost"
                className="font-bold font-mono"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};
