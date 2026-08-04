import nodemailer from 'nodemailer';
import dns from 'node:dns';

type TransportOptions = Parameters<typeof nodemailer.createTransport>[0];

// `service: 'gmail'` resolves smtp.gmail.com and can pick an IPv6 address on port
// 465 (implicit TLS). Render has no outbound IPv6 route, so that connection hangs
// until ETIMEDOUT/ENETUNREACH. Using STARTTLS on 587 with family:4 forces IPv4 so
// the connection actually reaches Gmail from Render.
// `family` and `lookup` are real Nodemailer/Node socket options but missing from
// @types/nodemailer, hence the cast.
//
// family:4 alone isn't enough — Node's own DNS resolution can still hand back an
// AAAA (IPv6) record before Nodemailer gets a chance to filter, so we also force
// IPv4-first resolution process-wide and pin the transport's own lookup to IPv4.
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4,
  lookup: (hostname: string, options: unknown, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) =>
    dns.lookup(hostname, { family: 4 }, callback),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
} as TransportOptions);

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
