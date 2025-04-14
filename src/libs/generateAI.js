import { openai } from "@/utils/openai";
import { revalidatePath } from "next/cache";

export const generateAI = async (formData) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat:free",
      messages: [
        {
          role: "system",
          content: `You are the secretary/personal assistant of this user:
              User:
              name: ${formData.userName}
              organization/company: ${formData.organization}
              Email: ${formData.senderEmail}
    
              Currently, you are ordered by user to make a ${
                formData.invoiceType
              } invoice cover letter to their client, with the following information:
    
              Recipient:
              organization/company: ${formData.recipient}
              Address: ${formData.recipientAddress}
              phone number: ${formData.recipientPhone}
              recipient email: ${formData.recipientEmail}
              item: ${formData.invoiceItems.map((item) => {
                return `${item.name} - item price :${item.price}`;
              })}
              quantity: ${formData.invoiceItems.map((item) => {
                return `${item.quantity}`;
              })}
              total prices: ${formData.totalPrice},
              bill due date: ${formData.dueDate}
    
              The results should be ready to use and will be sent to the client email
    
              IMPORTANT: JUST A LETTER, NO EXPLANATIONS AND KEY IMPROVEMENTS, NO USER PHONE NUMBER, ALL CURRENCY IN INDONESIAN RUPIAH, AND RESPONSE ARE IN ENGLISH
    
              OUPUT MUST BE IN VALID JSON FORMAT AND READY TO USE WITHOUT EDIT, WITHOUT ANY BACKTICKS (\`) AND WITHOUT '''JSON
    
              Example:
                {"subject":"email subject", "letter": "content you make(cover letter)"}
              `,
        },

        {
          role: "user",
          content: `I want to give an invoice to my client, please make a cover letter for the subject and body of the email, i want an ${formData.invoiceType} cover letter.`,
        },
      ],
      temperature: 0.7,
    });
    const result = completion.choices[0].message.content;

    const parsedResult = JSON.parse(result);

    return parsedResult;
  } catch (error) {
    console.log({
      message: "Error Generating letter",
      error: error,
    });
    return {
      subject: "Error",
      letter: "Error generating letter",
    };
  }
};
