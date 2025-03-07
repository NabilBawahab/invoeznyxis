import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard");
}
