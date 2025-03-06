import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!!sessionId) redirect("/dashboard");
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border p-6 shadow-md rounded-xl w-[350px]">
        {children}
      </div>
    </div>
  );
}
