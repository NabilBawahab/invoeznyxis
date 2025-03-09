"use server";

import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export async function deleteInvoice(formData) {
  const id = formData.get("id");

  try {
    await prisma.invoice.delete({ where: { id } });
  } catch (error) {
    console.log("Error deleting data");
  }

  redirect("/dashboard/history");
}
