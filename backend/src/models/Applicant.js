import mongoose from "mongoose";

const applicantSchema =
  new mongoose.Schema(

    {

      name: String,

      email: String,

      phone: String,

      resume: String,

      status: {
        type: String,
        default: "APPLIED",
      },

      parsedData: Object,

      jobId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Job",

      },

    },

    {
      timestamps: true,
    }

  );

export default mongoose.model(
  "Applicant",
  applicantSchema
);