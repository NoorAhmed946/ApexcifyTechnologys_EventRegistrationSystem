const jwt = require('jsonwebtoken');
const User = require('../models/users'); // 🛠️ Fixed: Changed 'User' to 'users' to match your actual file name

// 1. Protect: Verifies the User is logged in via JWT
const protect = async (req, res, next) => {
  let token;

  // Check for "Bearer <token>" in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract just the token part
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and attach to request (excluding the password)
      req.user = await User.findById(decoded.id).select('-password');
      
      // 🛠️ Optimization: Ensure the user actually exists in the database
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token is invalid');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
};

// 2. IsOrganizer: Checks if the user's role is 'organizer'
const isOrganizer = (req, res, next) => {
  if (req.user && req.user.role === 'organizer') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Access denied: You must be an Organizer to do this');
  }
};

module.exports = { protect, isOrganizer };
