import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    
  }
});




export default async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Esports Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
