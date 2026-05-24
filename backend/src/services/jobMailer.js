import nodemailer from "nodemailer";

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,

    },

  });


// ============================
// INTERVIEW EMAIL
// ============================

export const sendInterviewEmail =
  async ({
    candidateEmail,
    candidateName,
    company,
    date,
    time,
    meetingLink,
  }) => {

    try {

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          candidateEmail,

        subject:
          `Interview Scheduled - ${company}`,

        html: `

          <div style="font-family:sans-serif;padding:20px;">

            <h2>
              Interview Invitation
            </h2>

            <p>
              Hello ${candidateName},
            </p>

            <p>
              Your interview has been scheduled.
            </p>

            <ul>
              <li>
                <strong>Company:</strong>
                ${company}
              </li>

              <li>
                <strong>Date:</strong>
                ${date}
              </li>

              <li>
                <strong>Time:</strong>
                ${time}
              </li>

            </ul>

            <a href="${meetingLink}">
              Join Interview
            </a>

          </div>

        `,

      });

      return true;

    } catch (err) {

      console.log(err);

      return false;

    }

  };


// ============================
// REJECTION EMAIL
// ============================

export const sendRejectionEmail =
  async ({
    candidateEmail,
    candidateName,
    company,
  }) => {

    try {

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          candidateEmail,

        subject:
          `Application Update - ${company}`,

        html: `

          <div style="font-family:sans-serif;padding:20px;">

            <h2>
              Application Update
            </h2>

            <p>
              Hello ${candidateName},
            </p>

            <p>
              Thank you for applying at ${company}.
            </p>

            <p>
              We appreciate your time.
            </p>

          </div>

        `,

      });

      return true;

    } catch (err) {

      console.log(err);

      return false;

    }

  };