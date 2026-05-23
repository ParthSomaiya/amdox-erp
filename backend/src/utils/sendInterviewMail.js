import transporter
    from "../config/mailer.js";

export const sendInterviewMail =
    async (
        email,
        date
    ) => {

        await transporter.sendMail({

            from:
                process.env.EMAIL_USER,

            to: email,

            subject:
                "Interview Scheduled",

            html: `

    <h2>Interview Scheduled</h2>

    <p>
      Your interview date:
      ${date}
    </p>

  `,

        });

    };
