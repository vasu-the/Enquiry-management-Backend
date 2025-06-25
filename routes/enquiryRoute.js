const express = require("express");
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const enquiryController = require('../controllers/enquiryController');

router.post(
  '/enquiries',
  (req, res, next) => { console.log("Middleware: starting auth"); next(); },
  auth,
  (req, res, next) => { console.log("Middleware: starting upload"); next(); },
  (req, res, next) => {
    upload.single('file')(req, res, function (err) {
      if (err) {
        console.error("Multer/Cloudinary error:", err.message);
        return res.status(400).json({ error: 'Upload failed', message: err.message });
      }
      next();
    });
  },
  (req, res, next) => { console.log("Middleware: before controller"); next(); },
  enquiryController.createEnquiry
);

module.exports = router;
