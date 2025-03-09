import { prisma } from "@/utils/prisma";
import { auth } from "@/libs/auth";
import { InvoiceTable } from "./_components/invoice_table";
import { Card } from "@heroui/react";

export default async function Page() {
  const session = await auth();
  const userId = session.user.id;

  const invoices = await prisma.invoice.findMany({
    where: { authorId: userId },
  });

  return (
    <>
      <div className="w-5/6 m-auto">
        <p className="text-3xl mb-5">History</p>
        <Card className="shadow-md p-4 min-h-60">
          <p className="font-bold text-2xl">Invoices History</p>
          <hr className="my-4"></hr>
          <InvoiceTable invoices={invoices} />
        </Card>
      </div>
    </>
  );
}
