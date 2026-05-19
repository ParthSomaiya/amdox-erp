import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },

    permissions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Permission ||
  mongoose.model("Permission", permissionSchema);