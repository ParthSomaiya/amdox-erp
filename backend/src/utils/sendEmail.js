import nodemailer from "nodemailer";

// 🚀 પાર્થ સોમૈયાના ઓટોમેટેડ જીમેલ એકાઉન્ટ સાથે લિંક કરેલો સિક્યોર સેન્ડર
export const sendDirectEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ગુગલ ઓટો-સેટિંગ્સ
      auth: {
        user: process.env.SMTP_MAIL || "parthsomaiya2004@gmail.com", // 🔹 તમારો નવો ઈમેલ આઈડી
        pass: process.env.SMTP_PASSWORD || "obosygcbsgfcreqd", // 🔹 બધી જ સ્પેસ કાઢીને સળંગ ૧૬-આંકડાનો એપ પાસવર્ડ
      },
      tls: {
        rejectUnauthorized: false // લોકલ સિક્યોરિટી બાયપાસ
      }
    });

    const mailOptions = {
      from: `"AMDOX ERP" <${process.env.SMTP_MAIL || "parthsomaiya2004@gmail.com"}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("⚡ Email dispatched successfully! MessageID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ NODEMAILER SMTP SYSTEM ERROR DETECTED:", error.message);
    throw error;
  }
};