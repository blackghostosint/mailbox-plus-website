export const handler = async (event) => {
  try {
    const { token } = JSON.parse(event.body);
    const secret = process.env.VITE_RECAPTCHA_SECRET_KEY;

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });

    const data = await response.json();
    if (!data.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'reCAPTCHA verification failed' }),
      };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
