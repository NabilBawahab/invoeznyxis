import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";
import LayoutClient from "./layoutClient";

// for server action in layout

export default async function Layout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <LayoutClient session={session}>{children}</LayoutClient>;
}
