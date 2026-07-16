import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendResetCodeEmail(code: string) {
  const to = process.env.COMPANY_EMAIL;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Admin password verification code',
    text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes. If you did not request this, you can ignore this email.`,
    html: `<p>Your verification code is: <strong style="font-size:20px">${code}</strong></p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}
