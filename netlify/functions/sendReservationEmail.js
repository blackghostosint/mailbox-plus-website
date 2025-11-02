import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
  try {
    const { name, email, phone, plan } = JSON.parse(event.body);

    await resend.emails.send({
      from: "Mailbox Plus <info@mailboxplusohio.com>",
      to: "info@mailboxplusohio.com",
      subject: `📬 New Mailbox Reservation from ${name}`,
      html: `
        <h2>Mailbox Reservation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Selected Plan:</strong> ${plan}</p>
      `,
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error("Resend error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};