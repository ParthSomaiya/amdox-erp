import nodemailer from "nodemailer";

// ==============================
// 📧 TRANSPORTER
// ==============================

const transporter =
  nodemailer.createTransport({

    host:
      process.env.EMAIL_HOST,

    port:
      process.env.EMAIL_PORT,

    secure: false,

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,

    },

  });


// ==============================
// 📩 SEND EMAIL
// ==============================

export const sendEmail =
  async ({

    to,
    subject,
    html,

  }) => {

    try {

      await transporter.sendMail({

        from:
          `"Amdox ERP" <${process.env.EMAIL_USER}>`,

        to,

        subject,

        html,

      });

      console.log(
        "✅ Email sent:",
        to
      );

    } catch (err) {

      console.log(
        "❌ Email error:",
        err.message
      );

      throw err;

    }

  };
