const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}
console.log("JWT_SECRET loaded?", !!process.env.JWT_SECRET);


function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Unauthorized: missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { sub: userId, email, iat, exp }
    req.user = { id: decoded.sub, email: decoded.email };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid/expired token" });
  }
}

module.exports = { signToken, requireAuth };
