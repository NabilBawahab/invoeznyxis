"use server";

import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export async function deleteInvoice(_, formData) {
  const id = formData.get("id");

  try {
    await prisma.item.deleteMany({ where: { invoiceId: id } });
    await prisma.invoice.delete({ where: { id } });
  } catch (error) {
    console.log("Error deleting data", error);
  }

  redirect("/dashboard/history");
}
