import nodemailer from "nodemailer";
import { Resend } from "resend";

const hasResend = Boolean(process.env.RESEND_API_KEY);
const resend = hasResend ? new Resend(process.env.RESEND_API_KEY) : null;

const smtpConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
const transporter = smtpConfigured
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

const getFromAddress = () => {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!from) {
    throw new Error("EMAIL_FROM (or EMAIL_USER) is not configured");
  }
  return from;
};

export default async ({ to, subject, html }) => {
  const from = getFromAddress();

  if (hasResend) {
    await resend.emails.send({
      from: `"Esports Platform" <${from}>`,
      to,
      subject,
      html,
    });
    return;
  }

  if (!transporter) {
    throw new Error("Email provider not configured");
  }

  await transporter.sendMail({
    from: `"Esports Platform" <${from}>`,
    to,
    subject,
    html,
  });
};
