"use server";

import { prisma } from "@/utils/prisma";
import { openai } from "@/utils/openai";

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
  const organization = formData.organization;
  const senderEmail = formData.senderEmail;
  const totalPrice = formData.totalPrice;
  const type = formData.type; // type submit/preview

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
        phone number/email: ${recipientPhone} (phone), ${recipientEmail} (email)
        item: ${invoiceItems.map((item) => {
          return `${item.name} - item price :${item.price}`;
        })}
        quantity: ${invoiceItems.map((item) => {
          return `${item.quantity}`;
        })}
        total prices: (ITEM PRICE 1 X QUANTITY) + (ITEM PRICE 2 X QUANTITY) AND SO ON, 
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
    try {
      const newInvoice = await prisma.invoice.create({
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
        })),
      });

      const user = await prisma.user.findUnique({
        where: {
          id: authorId,
        },
      });
    } catch (error) {
      console.log({
        message: "Error creating invoice or invoice item",
        error: error,
      });
    }
  }
}
