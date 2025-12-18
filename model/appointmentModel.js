const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctorProfiles",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Booked",
    },

    prescription: [
      {
        medicine: { type: String, required: true },
        dosage: { type: String, required: true },   
        duration: { type: String, required: true }, 
        notes: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("appointments", appointmentSchema);
