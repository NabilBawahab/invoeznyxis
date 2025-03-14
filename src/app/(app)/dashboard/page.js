import { auth } from "@/libs/auth";
import { Link as HeroLink, Card } from "@heroui/react";
import { prisma } from "@/utils/prisma";
import { RecentInvoicesTable } from "./_components/recent_invoices";
import { RecentClientsTable } from "./_components/recent_clients";

export default async function Page() {
  const session = await auth();
  const username = session.user.username;
  const userOrganization = session.user.organization;
  const userId = session.user.id;

  const invoices = await prisma.invoice.findMany({
    where: { authorId: userId },
  });

  const invoiceCount = invoices.length;

  return (
    <>
      <div>
        <div className="w-5/6 m-auto">
          <div className="flex flex-col space-y-1 mb-5">
            <p className="text-4xl">Welcome, {username}</p>
            <p className="text-2xl text-gray-500">{userOrganization}</p>
          </div>
          <div className="grid grid-rows-1 grid-cols-2 gap-4">
            <Card className="col-span-2 shadow-md p-4">
              <div className="font-bold text-2xl">Dashboard</div>
              <hr className="my-4"></hr>
              <div className="grid grid-cols-3 grid-rows-1 gap-4">
                <div className="flex flex-col justify-around">
                  <p className="m-auto p-8 text-8xl font-bold">
                    {invoiceCount}
                  </p>
                  <hr className="my-2"></hr>
                  <p className="m-auto text-xl">Invoice count</p>
                </div>
                <div className="flex flex-col justify-around">
                  <p className="m-auto p-8 text-8xl font-bold">0</p>
                  <hr className="my-2"></hr>
                  <p className="m-auto text-xl">Invoices due</p>
                </div>
                <div className="flex flex-col justify-around">
                  <p className="m-auto p-8 text-8xl font-bold">$0</p>
                  <hr className="my-2"></hr>
                  <p className="m-auto text-xl">Total revenue</p>
                </div>
              </div>
            </Card>
            <Card className="shadow-md min-h-60 p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-xl">Recent invoices</p>
                  <p className="text-sm">Showing last 5 invoices</p>
                </div>
                <HeroLink
                  aria-label="View full history"
                  href="/dashboard/history"
                >
                  See all
                </HeroLink>
              </div>
              <hr className="my-4"></hr>

              <RecentInvoicesTable invoices={invoices} />
            </Card>
            <Card className="shadow-md min-h-60 p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-xl">Recent clients</p>
                  <p className="text-sm">Showing last 5 clients</p>
                </div>
                <HeroLink
                  aria-label="View full history"
                  href="/dashboard/history"
                >
                  See all
                </HeroLink>
              </div>
              <hr className="my-4"></hr>
              <RecentClientsTable clients={invoices} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
