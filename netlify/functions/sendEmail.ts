import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    await resend.emails.send({
      from: "Mailbox Plus <no-reply@mailboxplusohio.com>",
      to: "help@mailboxplusohio.com", // your Workspace inbox
      reply_to: data.email, // so replies go back to the sender
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Service Interest:</strong> ${data.service}</p>
        <p><strong>Message:</strong><br>${data.message}</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send message" }),
    };
  }
};