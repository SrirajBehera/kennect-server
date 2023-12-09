const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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

mongoose.model("User", userSchema);
