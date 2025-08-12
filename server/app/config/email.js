// config/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // use TLS for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Fallback plain-text content
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    console.error("❌ No recipient email (to) provided.");
    throw new Error("No recipient email defined");
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || "This is an HTML email. Please enable HTML view.",
    });

    console.log("✅ Email sent to:", to, "| Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
