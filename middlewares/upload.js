const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary'); 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'enquiries',
      format: file.mimetype.split('/')[1], 
      public_id: file.originalname.split('.')[0],
      resource_type: 'auto',
    };
  },
});


const fileFilter = (req, file, cb) => {
  console.log("Validating file type:", file.mimetype);
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

module.exports = upload;
