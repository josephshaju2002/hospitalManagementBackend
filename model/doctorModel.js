const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
      unique: true,
    },

    name: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },

    availableDays: {
      type: [String],
      default: [],
    },

    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },

    qualifications: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    fee: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("doctorProfiles", doctorProfileSchema);
