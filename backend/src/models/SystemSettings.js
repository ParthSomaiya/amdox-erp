import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    companySettings: {
      companyName: String,
      companyEmail: String,
      companyPhone: String,
      companyAddress: String,
    },

    smtpSettings: {
      smtpHost: String,
      smtpPort: String,
      smtpEmail: String,
      smtpPassword: String,
    },

    payrollSettings: {
      salaryDay: Number,
      overtimeEnabled: Boolean,
    },

    invoiceSettings: {
      invoicePrefix: String,
      gstEnabled: Boolean,
    },

    securitySettings: {
      passwordMinLength: Number,
      enable2FA: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SystemSettings",
  systemSettingsSchema
);