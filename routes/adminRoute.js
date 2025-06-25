const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const adminAuth = require("../middlewares/adminMiddleware");

router.post("/login", adminController.adminLogin);

router.get("/users", adminAuth, adminController.getUsers);
router.patch("/user/:id/status", adminAuth, adminController.toggleUserStatus);
router.get("/enquiries", adminAuth, adminController.getAllEnquiries);

module.exports = router;
