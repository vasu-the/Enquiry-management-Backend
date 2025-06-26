const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Enquiry = require("../models/enquiryModel");

// Admin login
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({ data: token, message: "Admin login successful" });
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: users, message: "Fetched all users" });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Toggle user active/inactive status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    return res.json({ message: "User status updated", isActive: user.isActive });
  } catch (err) {
    console.error("Toggle user status error:", err);
    return res.status(500).json({ message: "Failed to update user status" });
  }
};

// Get all enquiries (with populated user)
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    const result = enquiries.map((enq) => ({
      _id: enq._id,
      title: enq.title,
      description: enq.description,
      category: enq.category,
      fileUrl: enq.fileUrl,
      createdAt: enq.createdAt,
      user: enq.userId
        ? {
            _id: enq.userId._id,
            fullName: enq.userId.fullName,
            email: enq.userId.email,
          }
        : null,
    }));

    return res.status(200).json({ data: result, message: "Fetched all enquiries" });
  } catch (err) {
    console.error("Get enquiries error:", err);
    return res.status(500).json({ message: "Failed to fetch enquiries" });
  }
};
