const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Local in-memory storage
const usersCache = [];

// Helper: sync user to cache
const addToCache = (user) => {
  const exists = usersCache.find(u => u.email === user.email);
  if (!exists) {
    usersCache.push({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
    });
  }
};

// Signup
exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check DB
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    // Hash password and save
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashed,
      isActive: true,
    });

    // Sync to local cache
    addToCache(user);

    return res.status(201).json({ data: user, message: 'User created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check in-memory first (for speed)
    let user = usersCache.find(u => u.email === email);

    // If not found in cache, fallback to DB
    if (!user) {
      const dbUser = await User.findOne({ email });
      if (!dbUser) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      addToCache(dbUser); // cache it for next time
      user = dbUser;
    }

    // Validate status
    if (!user.isActive) {
      return res.status(400).json({ msg: 'Account is inactive' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Issue token
    const token = jwt.sign(
      { userId: user._id || user.id },
      process.env.JWT_SECRET || 'yoursecretkey',
      { expiresIn: '2h' }
    );

    return res.status(200).json({ data: token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
