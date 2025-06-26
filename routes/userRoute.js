const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const User = require('../models/userModel');
const auth = require('../middlewares/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ message: 'Access granted', user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});
module.exports = router;
