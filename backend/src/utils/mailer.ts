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

// Regular admins can't self-reset their password — this just notifies the company
// inbox so the super admin can reset it for them from Manage Admins in Settings.
export async function sendAdminResetRequestEmail(adminEmail: string) {
  const to = process.env.COMPANY_EMAIL;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Admin password reset requested',
    text: `The admin account "${adminEmail}" requested a password reset.\n\nOnly the super admin can reset it — go to Settings → Manage Admins in the dashboard to set a new password for this admin.`,
    html: `<p>The admin account <strong>${adminEmail}</strong> requested a password reset.</p><p>Only the super admin can reset it — go to <strong>Settings → Manage Admins</strong> in the dashboard to set a new password for this admin.</p>`,
  });
}

const SUBSCRIPTION_LABELS: Record<string, string> = {
  advertise: 'Advertise with us',
  partner: 'Become a partner',
  agent: 'Become an agent',
};

export async function sendSubscriptionEmail(subscriberEmail: string, type: string) {
  const to = process.env.COMPANY_EMAIL;
  const label = SUBSCRIPTION_LABELS[type] ?? type;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    replyTo: subscriberEmail,
    subject: `New subscription: ${label}`,
    text: `${subscriberEmail} subscribed to the newsletter and is interested in: ${label}.\n\nReply directly to this email to reach them.`,
    html: `<p><strong>${subscriberEmail}</strong> subscribed to the newsletter and is interested in: <strong>${label}</strong>.</p><p>Reply directly to this email to reach them.</p>`,
  });
}
