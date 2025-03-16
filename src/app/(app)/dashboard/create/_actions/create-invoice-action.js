"use server";

import { prisma } from "@/utils/prisma";
import { openai } from "@/utils/openai";
import { redirect } from "next/navigation";
import { resend } from "@/utils/resend";
import path from "path";
import fs from "fs";

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
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat:free",
      messages: [
        {
          role: "system",
          content: `You are the secretary/personal assistant of this user:
          User:
          name: ${userName}
          organization/company: ${organization}
          Email: ${senderEmail}

          Currently, you are ordered by user to make a ${invoiceType} invoice cover letter to their client, with the following information:

          Recipient:
          organization/company: ${recipient}
          Address: ${recipientAddress}
          phone number: ${recipientPhone}
          recipient email: ${recipientEmail}
          item: ${invoiceItems.map((item) => {
            return `${item.name} - item price :${item.price}`;
          })}
          quantity: ${invoiceItems.map((item) => {
            return `${item.quantity}`;
          })}
          total prices: ${totalPrice},
          bill due date: ${dueDate}

          The results should be ready to use and will be sent to the client email

          IMPORTANT: JUST A LETTER, NO EXPLANATIONS AND KEY IMPROVEMENTS, NO USER PHONE NUMBER, ALL CURRENCY IN INDONESIAN RUPIAH, AND RESPONSE ARE IN ENGLISH

          OUPUT MUST BE IN VALID JSON FORMAT AND READY TO USE WITHOUT EDIT, WITHOUT ANY BACKTICKS (\`) AND WITHOUT '''JSON

          Example:
            {"subject":"email subject", "letter": "content you make(cover letter)"}
          `,
        },

        {
          role: "user",
          content: `I want to give an invoice to my client, please make a cover letter for the subject and body of the email, i want an ${invoiceType} cover letter.`,
        },
      ],
      temperature: 0.7,
    });
    const result = completion.choices[0].message.content;

    try {
      const parsedResult = JSON.parse(result);

      return parsedResult;
    } catch (error) {
      console.log({
        message: "Error parsing JSON",
        error: error,
      });
    }
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
  }

  redirect(`/dashboard/history/${newInvoice.id}`);
}
