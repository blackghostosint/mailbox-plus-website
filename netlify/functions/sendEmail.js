import { Resend } from 'resend';

export const handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Mailbox Plus <no-reply@mailboxplusohio.com>',
      to: 'help@mailboxplusohio.com',
      subject: `New Contact Form Message from ${data.name}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Service: ${data.service || 'N/A'}
Message:
${data.message}
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Resend sendEmail error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message' }),
    };
  }
};
