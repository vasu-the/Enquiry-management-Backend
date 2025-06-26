const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['Feedback', 'Issues', 'Feature Request'], required: true },
  fileUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);
