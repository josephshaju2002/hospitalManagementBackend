const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
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
  profile: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "Medipulse User",
  },
   number: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
  },
  health: {
  bloodGroup: { type: String, default: "" },
  height: { type: String, default: "" },
  weight: { type: String, default: "" },
  allergies: { type: String, default: "" },
  conditions: { type: String, default: "" },
  medications: { type: String, default: "" },
  smoking: { type: String, default: "No" },
  alcohol: { type: String, default: "No" },
},

});

const users = mongoose.model("users",userSchema)
module.exports = users
