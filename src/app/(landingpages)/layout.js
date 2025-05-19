import { HomepageHeaders } from "@/app/(landingpages)/_components/homepageheader";
import { auth } from "@/libs/auth";

export default async function Layout({ children }) {
  const session = await auth();
  return (
    <>
      <HomepageHeaders session={session} />
      <main className="min-h-screen bg-[#f4f6f8]">{children}</main>
    </>
  );
}
