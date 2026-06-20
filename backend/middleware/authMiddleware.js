const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the database
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, identity not found in database' });
    }

  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
  
  // 🚨 THE GOLDEN FIX: next() ko try-catch ke bahar nikal diya! 
  // Ab aage ka koi crash fake token error nahi dega.
  next();
};

// Role check middleware (Case-Insensitive: ab hr aur HR dono ko pass karega)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Hum security check ke liye dono (allowed aur user_role) ko lowercase kar rahe hain
    const allowedRoles = roles.map(r => r.toLowerCase());
    const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : '';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Access Restricted: Your role '${userRole}' is not authorized for this action.` 
      });
    }
    
    next();
  };
};

module.exports = { protect, authorize };