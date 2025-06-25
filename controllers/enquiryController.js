const Enquiry = require('../models/enquiryModel');

// In-memory local cache for enquiries
const enquiryCache = [];

exports.createEnquiry = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const file = req.file;

    if (!title || !category || !file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create enquiry in DB
    const enquiry = new Enquiry({
      userId: req.user.userId,
      title,
      description,
      category,
      fileUrl: file.filename,
    });

    await enquiry.save();

    // Add to in-memory cache
    enquiryCache.push({
      id: enquiry._id,
      userId: enquiry.userId,
      title: enquiry.title,
      description: enquiry.description,
      category: enquiry.category,
      fileUrl: enquiry.fileUrl,
    });

    return res.status(201).json({ data: enquiry, message: 'Enquiry submitted' });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return res.status(500).json({ error: error.message, message: 'Failed to submit enquiry' });
  }
};

// Optional: function to get cached enquiries (for testing/debugging)
exports.getCachedEnquiries = (req, res) => {
  return res.status(200).json({ data: enquiryCache });
};
