"use server";
import { auth } from "@/libs/auth";
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutAction = async () => {
  const cookieStore = await cookies();
  const session = await auth();

  cookieStore.delete("sessionId");

  try {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
  } catch (error) {
    console.log("Logout Error", error);
  }
};
