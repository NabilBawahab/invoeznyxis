import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

export const auth = async () => {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return null;
  }
  let session = [];
  try {
    session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarURL: true,
            organization: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.log({ message: `Error fetching session: ${error}` });
    return null;
  }

  if (!session) {
    return null;
  }

  return session;
};
