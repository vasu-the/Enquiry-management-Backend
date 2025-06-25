// controllers/enquiryController.js
const Enquiry = require("../models/enquiryModel");

exports.createEnquiry = async (req, res) => {
  try {
    const { title, description, category, userId } = req.body;

    if (!title || !category || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const fileData = req.file
      ? {
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : null;

    const newEnquiry = new Enquiry({
      title,
      description,
      category,
      userId,
      file: fileData,
    });

    await newEnquiry.save();

    return res.status(201).json({
      message: "Enquiry submitted and saved successfully.",
      enquiry: newEnquiry,
    });
  } catch (err) {
    console.error("Error saving enquiry:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
