// middlewares/enquiryUpload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage destination and filename strategy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const uniqueName = `${timestamp}-${random}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|docx|jpg|jpeg|png/;
  const extname = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(extname)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, JPG, JPEG, PNG files are allowed"));
  }
};

// File size limit: 5MB
const limits = { fileSize: 5 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits });

module.exports = upload.single("file");
