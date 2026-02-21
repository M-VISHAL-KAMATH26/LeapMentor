// src/middleware/authenticate.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Verifies JWT and attaches user to req.user
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Role guard — use after authenticate
// Usage: router.get("/mentor-only", authenticate, requireRole("mentor"), handler)
const requireRole = (...roles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

module.exports = { authenticate, requireRole };