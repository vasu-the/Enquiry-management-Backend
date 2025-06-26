const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed });

    return res.status(201).json({ data: user, message: 'User created' });
  } catch (err) {
     console.log(err);
    return res.status(500).json({ message: err.message });
   
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isActive) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

 const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);
console.log('jwtttttt:', process.env.JWT_SECRET);
res.status(200).json({
  message: 'Login successful',
  token,
  user: {
    _id: user._id,
    email: user.email,
    role: user.role,
  },
});

console.log('Login response:', user,token);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
