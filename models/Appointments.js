const mongoose = require("mongoose");

const appointmentsSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    agentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
    agentname: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    date: {
      type: Date,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    bookingStatus: {
      type: String,
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointments", appointmentsSchema);
