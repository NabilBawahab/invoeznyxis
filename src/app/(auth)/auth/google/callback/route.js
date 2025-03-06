import { google } from "@/utils/arctic";
import { prisma } from "@/utils/prisma";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req) {
  const query = req.nextUrl.searchParams;
  const cookieStore = await cookies();

  const code = query.get("code");

  const codeVerifier = cookieStore.get("codeVerifier")?.value;

  // code validation
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);

  const accessToken = tokens.accessToken();

  const res = await fetch(process.env.GOOGLE_OPENID_CONNECT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        username: data.name,
        email: data.email,
      },
    });

    const newSession = await prisma.session.create({
      data: {
        userId: newUser.id,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    cookieStore.set("sessionId", newSession.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
    });

    redirect("/dashboard");
  }

  const newSession = await prisma.session.create({
    data: {
      userId: user.id,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  cookieStore.set("sessionId", newSession.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
  });

  redirect("/dashboard");

  // return Response.json({ message: "Tes" });
}
