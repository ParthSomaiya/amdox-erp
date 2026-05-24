import mongoose from "mongoose";

const timelineSchema =
  new mongoose.Schema(
    {

      employee: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      action: String,

    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Timeline",
  timelineSchema
);