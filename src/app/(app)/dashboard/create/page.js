import { auth } from "@/libs/auth";
import CreateInvoiceForm from "./_components/create-invoice-form";

export default async function Page() {
  const session = await auth();

  return (
    <main className="w-full max-h-screen space-y-4">
      <CreateInvoiceForm session={session} />
    </main>
  );
}
