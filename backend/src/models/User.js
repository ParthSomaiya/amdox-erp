import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================

    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // SECURITY: never return password
    },

    // ================= ROLE SYSTEM =================

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
      index: true,
    },

    // ================= PERMISSIONS =================

    permissions: {
      type: [String],
      default: [],
    },

    // ================= AUTH TOKENS =================

    refreshToken: {
      type: String,
      default: null,
    },

    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpiry: {
      type: Date,
      default: null,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    // ================= EMAIL VERIFICATION =================

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ================= COMPANY RELATION =================

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },

    // ================= STATUS =================

    isActive: {
      type: Boolean,
      default: true,
    },

    // ================= ACTIVITY TRACKING =================

    lastActive: {
      type: Date,
      default: Date.now,
    },

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

// ================= INDEXES (IMPORTANT FOR PERFORMANCE) =================

userSchema.index({ email: 1, companyId: 1 });
userSchema.index({ role: 1, isActive: 1 });

export default mongoose.model("User", userSchema);