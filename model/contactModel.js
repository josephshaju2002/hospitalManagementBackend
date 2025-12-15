const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    role: { type: String, enum: ["user", "doctor"], required: true },
  },
  { timestamps: true }
);

const contactMessages = mongoose.model("contactMessages", contactMessageSchema);
module.exports = contactMessages;
