"use server";

import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export async function createInvoiceAction(_, formData) {
  const name = formData.name;
  const dueDate = formData.dueDate;
  const recipient = formData.recipient;
  const recipientEmail = formData.recipientEmail;
  const recipientPhone = formData.recipientPhone;
  const recipientAddress = formData.recipientAddress;
  const authorId = formData.authorId;
  const invoiceItems = formData.invoiceItems;
  let newInvoice;
  try {
    newInvoice = await prisma.invoice.create({
      data: {
        name,
        dueDate,
        recipient,
        recipientEmail,
        recipientPhone,
        recipientAddress,
        authorId,
      },
    });
    await prisma.item.createMany({
      data: invoiceItems.map((item) => ({
        ...item,
        invoiceId: newInvoice.id,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
    });
  } catch (error) {
    console.log({
      message: "Error creating invoice or invoice item",
      error: error,
    });
  }

  console.log("id: ", newInvoice.id);
  redirect(`/dashboard/history/${newInvoice.id}`);
}
