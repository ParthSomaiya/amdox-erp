import mongoose from "mongoose";

const applicantSchema =
  new mongoose.Schema(
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },

      name: String,

      email: String,

      phone: String,

      resume: String,

      status: {
        type: String,

        enum: [
          "APPLIED",
          "SHORTLISTED",
          "INTERVIEW",
          "REJECTED",
          "HIRED",
        ],

        default: "APPLIED",
      },

      parsedData: {

        skills: [String],

        experience: String,

        education: String,

        rawText: String,

      },


      interviewDate: Date,

      notes: String,
    },
    { timestamps: true }
  );

export default
  mongoose.models.Applicant ||
  mongoose.model(
    "Applicant",
    applicantSchema
  );