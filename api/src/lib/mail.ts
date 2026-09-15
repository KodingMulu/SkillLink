import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, text: string) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error("EMAIL_USER or EMAIL_PASS missing in environment variables.");
    throw new Error("Mail configuration error: EMAIL_USER or EMAIL_PASS missing.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: `"SkillLink Admin" <${emailUser}>`,
    to,
    subject,
    text,
  });
}
