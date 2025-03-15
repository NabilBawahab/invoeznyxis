"use server";

import { prisma } from "@/utils/prisma";

export async function updateInvoiceAction(_, formData) {
  const name = formData.name;
  const dueDate = formData.dueDate;
  const recipient = formData.recipient;
  const recipientEmail = formData.recipientEmail;
  const recipientPhone = formData.recipientPhone;
  const recipientAddress = formData.recipientAddress;
  const authorId = formData.authorId;
  const invoiceItems = formData.invoiceItems;
  const invoiceId = formData.id;
  try {
    const newInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
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
    await prisma.item.deleteMany({ where: { invoiceId } });
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
      message: "Error updating invoice or invoice item",
      error: error,
    });
  }
}
