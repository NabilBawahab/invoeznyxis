"use server";

import { auth } from "@/libs/auth";
import { uploadFile } from "@/libs/file-ops";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export async function updateProfileAction(_, formData) {
  const session = await auth();
  const currentUsername = session.user.username;
  const currentOrganization = session.user.organization;
  const currentAvatarURL = session.user.avatarURL;

  const userId = formData.get("id");
  let username = formData.get("username").trim();
  let organization = formData.get("organization").trim();
  let avatarURL = null;
  const image = formData.get("avatar");

  if (image && image.size > 0) {
    avatarURL = `${process.env.R2_PUBLIC_URL}/${session.user.id}/${image.name}`;
  } else {
    avatarURL = currentAvatarURL;
  }

  if (!username) {
    username = currentUsername;
  }

  if (!organization) {
    organization = currentOrganization;
  }

  try {
    await uploadFile({ key: image.name, folder: session.user.id, body: image });

    await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        organization,
        avatarURL,
      },
    });
  } catch (error) {
    console.log("Error pushing data", error);
  }

  redirect("/dashboard/profile");
}
