"use server";

import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import { resend } from "@/utils/resend";
import path from "path";
import fs from "fs";
import { generateAI } from "@/libs/generateAI";

export async function createInvoiceAction(_, formData) {
  const name = formData.name;
  const userName = formData.userName;
  const dueDate = formData.dueDate;
  const recipient = formData.recipient;
  const recipientEmail = formData.recipientEmail;
  const recipientPhone = formData.recipientPhone;
  const recipientAddress = formData.recipientAddress;
  const authorId = formData.authorId;
  const invoiceItems = formData.invoiceItems;
  const invoiceType = formData.invoiceType;
  const organization = formData.userOrganization;
  const senderEmail = formData.senderEmail;
  const totalPrice = formData.totalPrice;
  const type = formData.type; // type submit/preview

  let newInvoice;

  if (type === "generate") {
    return await generateAI(formData);
  }
  if (type === "submit") {
    const subject = formData.subject;
    const letter = formData.letter;

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

      const user = await prisma.user.findUnique({
        where: {
          id: authorId,
        },
      });

      // const filePath = "http://localhost:3000/invoice-email-template.html"; // ini untuk di dev
      const filePath = "https://www.invoezz.com/invoice-email-template.html"; // ini untuk di production

      const response = await fetch(filePath);
      let html = await response.text();

      html = html.replace("{{recipient}}", recipient);
      html = html.replace("{{recipientEmail}}", recipientEmail);
      html = html.replace("{{recipientAddress}}", recipientAddress);
      html = html.replace("{{recipientPhone}}", recipientPhone);
      html = html.replace("{{userName}}", userName);
      html = html.replace("{{senderEmail}}", senderEmail);
      html = html.replace("{{dueDate}}", dueDate);
      html = html.replace("{{totalPrice}}", totalPrice);
      html = html.replace("{{letter}}", letter);
      html = html.replace(
        "{{invoiceItems}}",
        invoiceItems
          .map((item) => {
            return `<tr>
          <td>${item.name}</td>
          <td>${item.description}</td>
          <td>Rp${item.price}</td>
          <td>${item.quantity}</td>
          <td>Rp${item.price * item.quantity}</td>
        </tr>`;
          })
          .join("")
      );

      await resend.emails.send({
        from: "InvoEzz <no-reply@invoezz.com>",
        to: [recipientEmail],
        subject: subject,
        text: letter,
        html: html,
      });
    } catch (error) {
      console.log({
        message: "Error creating invoice or invoice item",
        error: error,
      });
    }
    redirect(`/dashboard/history/${newInvoice.id}`);
  }
}
