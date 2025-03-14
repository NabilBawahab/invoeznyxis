import { auth } from "@/libs/auth";
import UpdateInvoiceForm from "./_components/update-invoice-form";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export default async function Page({ params }) {
  const session = await auth();

  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
  });

  const items = await prisma.item.findMany({
    where: { invoiceId: invoice.id },
  });

  const serializedItems = items.map((item) => ({
    ...item,
    price: item.price.toString(),
  }));

  if (invoice.authorId !== session.user.id) {
    redirect("/dashboard/history");
  }

  return (
    <main className="w-full max-h-screen space-y-4">
      <UpdateInvoiceForm
        session={session}
        invoice={invoice}
        items={serializedItems}
      />
    </main>
  );
}
