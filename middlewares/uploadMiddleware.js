const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage strategy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");

    // Ensure 'uploads' directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Use recursive for nested folders
    }

    console.log("Upload directory:", uploadDir);
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const uniqueName = `${timestamp}-${random}-${file.originalname}`;

    console.log("Uploading file with name:", uniqueName);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|docx|jpg|jpeg|png/;
  const extname = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(extname)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, JPG, PNG files are allowed"));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports = upload;
