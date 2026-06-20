const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Enterprise user already exists' });

    // Force default role and status
    const user = await User.create({
      name,
      email,
      password,
      role: 'Employee',
      status: 'Pending' // Starts as pending
    });

    if (user) {
      // Token NAHI bhejenge signup pe, sirf success message!
      res.status(201).json({ message: 'Profile created successfully. Pending Admin approval.' });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      
      // GOD LEVEL BLOCKER
      if (user.status === 'Pending') {
        return res.status(403).json({ message: 'Access Denied: Your account is pending Admin approval.' });
      }
      if (user.status === 'Suspended') {
        return res.status(403).json({ message: 'Access Denied: Your account has been suspended.' });
      }

      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid corporate email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = { registerUser, loginUser };