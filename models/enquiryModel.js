const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  category: { type: String, enum: ['feedback', 'issues', 'feature requests'] },
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);
