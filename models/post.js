const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    // will automatically give a timestamp of createdAt and updatedAt
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.model("Post", postSchema);
