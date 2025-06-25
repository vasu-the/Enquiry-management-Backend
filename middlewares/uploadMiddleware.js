const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folder exists
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Sanitize file name
const sanitizeFilename = (name) => name.replace(/[^a-z0-9_\-\.]/gi, '_');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const sanitizedOriginal = sanitizeFilename(file.originalname);
    const uniqueName = `${timestamp}-${random}-${sanitizedOriginal}`;
    cb(null, uniqueName);
  },
});

// Allowed file extensions
const allowedTypes = /\.(pdf|docx|jpg|jpeg|png)$/i;

const fileFilter = (req, file, cb) => {
  if (allowedTypes.test(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        'Only PDF, DOCX, JPG, and PNG files are allowed.'
      )
    );
  }
};

// Set file size limit
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Final multer config
const upload = multer({
  storage,
  fileFilter,
  limits,
});

// Export handlers
module.exports = {
  uploadSingle: upload.single("file"), // For single file uploads
  uploadMultiple: upload.array("files", 5), // For multiple file uploads
};
