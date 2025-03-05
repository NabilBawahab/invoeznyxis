"use server";
import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
export async function registerAction(_, formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const organization = formData.get("organization");
  const password = formData.get("password");
  const confirmedPassword = formData.get("confirm-password");

  let fieldsError = {};
  fieldsError.usernameValue = username;
  fieldsError.emailValue = email;
  fieldsError.organizationValue = organization;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    fieldsError.email = "This user already registered!";
    return {
      success: false,
      fieldsError,
    };
  }

  if (confirmedPassword !== password) {
    fieldsError.confirmedPassword =
      "Confrimed password is not matched with your password";

    return {
      success: false,
      fieldsError,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    await prisma.user.create({
      data: {
        username,
        email,
        organization,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return {
      success: false,
      message: "Oops, internal serve error",
    };
  }

  return {
    success: true,
    message: "Yeayy, you are registered in our system!",
  };
}
