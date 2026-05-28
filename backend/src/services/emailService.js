import nodemailer from "nodemailer";

// ==============================
// 📧 CREATE TRANSPORTER (PRODUCTION READY)
// ==============================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true only for 465

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false, // fixes many hosting issues
  },
});

// ==============================
// 🧪 VERIFY CONNECTION (SAFE DEBUG)
// ==============================

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server connection failed:", error.message);
  } else {
    console.log("📧 Email server ready to send messages");
  }
});

// ==============================
// 📩 SEND EMAIL FUNCTION
// ==============================

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // ================= VALIDATION =================
    if (!to || !subject || !html) {
      throw new Error("Missing email fields (to, subject, html)");
    }

    const mailOptions = {
      from: `"Amdox ERP" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully → ${to}`);

    return result;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);

    // rethrow for queue handling
    throw new Error("Email service error");
  }
};