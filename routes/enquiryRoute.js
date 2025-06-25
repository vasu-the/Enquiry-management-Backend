const express = require("express");
const router = express.Router();
const {uploadSingle} = require("../middlewares/uploadMiddleware");
const auth = require('../middlewares/authMiddleware');
const enquiryController = require('../controllers/enquiryController');
router.post("/enquiries", auth, uploadSingle, enquiryController.createEnquiry);

module.exports = router;
