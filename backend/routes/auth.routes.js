const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("../models/User.model");
const { signToken } = require("./_jwt");

/**
 * POST /api/auth/register
 * Body: { email, password, name?, roles? }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, roles } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const cleanedRoles =
      Array.isArray(roles) && roles.length
        ? Array.from(new Set(roles)).filter((r) => ["mentor", "mentee"].includes(r))
        : ["mentee"];

    const user = await User.create({
      email,
      name: name || "",
      roles: cleanedRoles,
      passwordHash,
      emailVerified: false,
    });

    const token = signToken({ sub: String(user._id), email: user.email });

    return res.status(201).json({
      message: "Registered",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    // passwordHash is select:false in model → must select it
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+passwordHash");

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({ sub: String(user._id), email: user.email });

    return res.json({
      message: "Logged in",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * Social routes still TODO (later)
 */
router.get("/:provider/start", async (req, res) => {
  return res.json({ message: "socialStart (TODO)" });
});

router.get("/:provider/callback", async (req, res) => {
  return res.json({ message: "socialCallback (TODO)" });
});

router.post("/logout", async (req, res) => {
  // With stateless JWT, logout is handled on client by deleting token
  return res.json({ message: "Logged out (client deletes token)" });
});

module.exports = router;
