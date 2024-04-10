const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    displayName: String,
    email: { type: String, unique: true },
    image: String,
    occupation: String,
    state: String,
    country: String,
    city: String,
    isVerified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);
userSchema.index({ "$**": "text" });
const User = new mongoose.model("users", userSchema);

module.exports = User;
