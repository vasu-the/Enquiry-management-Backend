// controllers/enquiryController.js

const Enquiry = require("../models/enquiryModel");
const fs = require("fs");

exports.createEnquiry = async (req, res) => {
  try {
    const file = req.file;
    const { title, description, category } = req.body;

    // Validate required fields
    if (!title || !category || !file) {
      if (file?.path) fs.unlinkSync(file.path);
      return res.status(400).json({
        message: "Missing required fields: title, category, or file",
      });
    }

    const enquiry = new Enquiry({
      userId: req.user.userId,
      title,
      description,
      category,
      fileUrl: file.filename, // optionally: `/uploads/${file.filename}`
    });

    await enquiry.save();

    return res.status(201).json({
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path); // Cleanup failed upload
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError.message);
      }
    }

    return res.status(500).json({
      message: "Failed to submit enquiry",
      error: error.message,
    });
  }
};
