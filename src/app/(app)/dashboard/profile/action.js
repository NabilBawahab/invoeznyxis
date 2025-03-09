"use server";

import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export async function updateProfileAction(_, formData) {
  const username = formData.get("username").trim();
  const organization = formData.get("organization").trim();
  const id = formData.get("id");

  if (!username) {
    redirect("/dashboard/profile");
  }

  if (!organization) {
    redirect("/dashboard/profile");
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { username, organization },
    });
  } catch (error) {
    console.log("Error pushing data", error);
  }

  redirect("/dashboard/profile");
}
