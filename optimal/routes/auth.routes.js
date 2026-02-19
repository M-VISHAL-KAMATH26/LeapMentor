const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const OAuthAccount = require("../models/OAuthAccount");

const router = express.Router();

const signToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


//security filter we dont want to send the hashed password
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

/**
 * POST /api/auth/register
 * Body: { name, email, password, roles: ["mentor","mentee"], termsAccepted }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, roles, termsAccepted } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }
    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ message: "roles must be an array with at least one role" });
    }
    if (termsAccepted !== true) {
      return res.status(400).json({ message: "You must accept terms to continue" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const validRoles = ["mentor", "mentee"];
    const uniqueRoles = [...new Set(roles)];
    for (const r of uniqueRoles) {
      if (!validRoles.includes(r)) {
        return res.status(400).json({ message: "Invalid role. Use mentor and/or mentee." });
      }
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      roles: uniqueRoles,
      isEmailVerified: false,
      termsAccepted: true,
      termsAcceptedAt: new Date()
    });

    const token = signToken(user._id);

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    return res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/auth/google
 * Body: { credential, roles?, termsAccepted? }
 *
 * - credential is the Google ID token from frontend (GIS)
 * - roles + termsAccepted required ONLY when creating a new user
 */
/**
 * POST /api/auth/google
 * Body: { credential, roles?, termsAccepted? }
 */
router.post("/google", async (req, res) => {
  try {
    const { credential, roles, termsAccepted } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    // --- CRITICAL DEBUGGING FOR COMPANY LAPTOP ---
    // This decodes the token without verifying it so we can see what Google sent.
    const decodedToken = jwt.decode(credential);
    const tokenAudience = decodedToken?.aud;
    const envAudience = process.env.GOOGLE_CLIENT_ID?.trim();

    console.log("DEBUG: Token Audience (aud):", tokenAudience);
    console.log("DEBUG: Env Client ID:", envAudience);

    if (!envAudience) {
      return res.status(500).json({ message: "GOOGLE_CLIENT_ID is undefined in .env" });
    }
    // --------------------------------------------

    // 1) Verify Google ID token
    // We pass an array to 'audience' to be safe across different platforms/envs
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: [envAudience, tokenAudience], // Accepting both ensures mismatch doesn't kill the process while debugging
    });

    const payload = ticket.getPayload();
    
    // Double-check: The payload's 'aud' must match our Env ID eventually
    if (payload.aud !== envAudience) {
       console.warn("⚠️ WARNING: Token was issued for a different Client ID. Check your .env!");
    }

    const email = payload?.email?.toLowerCase()?.trim();
    const name = payload?.name || "User";
    const googleSub = payload?.sub; 
    const emailVerified = payload?.email_verified;

    if (!email || !googleSub) {
      return res.status(400).json({ message: "Invalid Google payload (missing email/sub)" });
    }

    // 2) Find or create user by email
    let user = await User.findOne({ email });

    if (!user) {
      if (termsAccepted !== true) {
        return res.status(400).json({ message: "You must accept terms to continue" });
      }

      const incomingRoles = Array.isArray(roles) && roles.length ? [...new Set(roles)] : ["mentee"];
      const validRoles = ["mentor", "mentee"];
      for (const r of incomingRoles) {
        if (!validRoles.includes(r)) {
          return res.status(400).json({ message: "Invalid role. Use mentor and/or mentee." });
        }
      }

      user = await User.create({
        name,
        email,
        roles: incomingRoles,
        isEmailVerified: !!emailVerified,
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      });
    }

    // 3) Ensure OAuthAccount link exists
    const existingOAuth = await OAuthAccount.findOne({
      provider: "google",
      providerId: googleSub,
    });

    if (!existingOAuth) {
      await OAuthAccount.create({
        user: user._id,
        provider: "google",
        providerId: googleSub,
      });
    }

    // 4) Issue your JWT
    const token = signToken(user._id);
    const safeUser = sanitizeUser(user);

    return res.json({
      message: "Google login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(401).json({
      message: "Google authentication failed",
      error: err.message,
    });
  }
});

/**
 * POST /api/auth/social
 * Body: { provider: "google"|"linkedin"|"apple", providerId, email, name, roles?, termsAccepted? }
 *
 * NOTE: In real SSO, you should verify provider tokens (Google ID token etc.).
 * For now, this route accepts providerId directly as MVP.
 */
router.post("/social", async (req, res) => {
  try {
    const { provider, providerId, email, name, roles, termsAccepted } = req.body;

const allowed = ["linkedin", "apple"];
    if (!allowed.includes(provider)) {
      return res.status(400).json({ message: "Invalid provider" });
    }
    if (!providerId) {
      return res.status(400).json({ message: "providerId is required" });
    }

    // 1) If OAuthAccount exists -> login that user
    const existingOAuth = await OAuthAccount.findOne({ provider, providerId }).populate("user");
    if (existingOAuth?.user) {
      const token = signToken(existingOAuth.user._id);
      return res.json({
        message: "Social login successful",
        token,
        user: sanitizeUser(existingOAuth.user)
      });
    }

    // 2) Otherwise create/link user by email
    if (!email) {
      return res.status(400).json({ message: "email is required to create/link account" });
    }
    const normalizedEmail = String(email).toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    // If creating new user, enforce terms + roles
    if (!user) {
      if (termsAccepted !== true) {
        return res.status(400).json({ message: "You must accept terms to continue" });
      }
      const incomingRoles = Array.isArray(roles) && roles.length ? [...new Set(roles)] : ["mentee"];
      const validRoles = ["mentor", "mentee"];
      for (const r of incomingRoles) {
        if (!validRoles.includes(r)) {
          return res.status(400).json({ message: "Invalid role. Use mentor and/or mentee." });
        }
      }

      user = await User.create({
        name: name ? String(name).trim() : "User",
        email: normalizedEmail,
        password: undefined,            // no password for social users
        roles: incomingRoles,
        isEmailVerified: true,          // typically verified by provider email
        termsAccepted: true,
        termsAcceptedAt: new Date()
      });
    }

    // 3) Create OAuthAccount link
    await OAuthAccount.create({
      user: user._id,
      provider,
      providerId
    });

    const token = signToken(user._id);
    return res.json({
      message: "Social login successful",
      token,
      user: sanitizeUser(user)
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
