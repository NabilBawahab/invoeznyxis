import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }) {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("sessionId");
  if (!sessionId) redirect("/login");

  const userDatabseSession = await prisma.session.findUnique({
    where: {
      id: sessionId.value,
    },
  });

  if (!userDatabseSession) redirect("/login");
  const currentDate = new Date();
  if (userDatabseSession.expiredAt < currentDate) redirect("/login");

  return <>{children}</>;
}
