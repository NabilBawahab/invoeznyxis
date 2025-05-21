import { TypedJs } from "@/components/typed";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <section className="bg-[#8c94a4] min-h-screen flex items-center">
        <div className="flex flex-col-reverse gap-6 md:flex-row items-center px-6 justify-between md:px-20 py-20 text-white max-w-7xl mx-auto">
          <div className="max-w-md text-center md:text-left">
            <h1 className="text-4xl font-bold font-openSans leading-snug">
              Best invoicing software for{" "}
              <TypedJs className="text-3xl text-yellow-300 font-bold" />
            </h1>
            <p className="mt-4 text-lg font-medium text-gray-100">
              Simple, smart & fast way to manage your invoices and clients with
              AI Powered letter creation
            </p>
            <Button
              as={Link}
              href="/register"
              className="mt-8 bg-yellow-300 text-slate-700 font-bold"
              size="lg"
            >
              Get started, it's free!
            </Button>
          </div>
          <div>
            <Image
              src="/logo.jpeg"
              width={300}
              height={300}
              alt="invoezlogo"
              className="rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
}
