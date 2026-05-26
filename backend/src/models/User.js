import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    phone: String,

    password: String,

    role: {
      type: String,
      enum: [
        "ADMIN",
        "HR",
        "FINANCE",
        "EMPLOYEE",
        "EMPLOYER",
        "JOB_SEEKER",
      ],
      default: "EMPLOYEE",
    },

    // ✅ MULTIPLE PERMISSIONS
    permissions: [
      {
        type: String,
      },
    ],

    refreshToken: String,

    resetToken: String,

    resetTokenExpiry: Date,

    // ✅ EMAIL VERIFICATION
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ ACTIVITY TRACKING
    lastActive: Date,

    loginHistory: [
      {
        ip: String,
        device: String,
        loginAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User",
  userSchema
);