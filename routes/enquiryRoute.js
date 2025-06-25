const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const auth = require('../middlewares/authMiddleware');
const enquiryController = require('../controllers/enquiryController');
router.post("/enquiries", auth, upload.single("file"), enquiryController.createEnquiry, async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);
    res.status(200).json({ message: "Enquiry submitted successfully!" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "File upload failed." });
  }
});

module.exports = router;
