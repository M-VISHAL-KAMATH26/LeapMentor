const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const VerificationToken = require("../models/VerificationToken");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const makeOtp = () => String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
const makeLinkToken = () => crypto.randomBytes(32).toString("hex");

/**
 * POST /api/verification/send
 * Body: { email, method: "otp"|"link" }
 */
router.post("/send", async (req, res) => {
  try {
    const { email, method } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const chosen = method === "link" ? "link" : "otp";

    // delete old tokens for this user
    await VerificationToken.deleteMany({ user: user._id });

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let otpPlain = null;
    let tokenPlain = null;

    if (chosen === "otp") {
      otpPlain = makeOtp();
      const otpHash = await bcrypt.hash(otpPlain, 10);

      await VerificationToken.create({
        user: user._id,
        otp: otpHash,
        expiresAt
      });

      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: "LeapMentor Email Verification OTP",
        text: `Your OTP is: ${otpPlain}\nIt expires in 10 minutes.`,
      });

      return res.json({ message: "OTP sent to email" });
    }

    // link method
    tokenPlain = makeLinkToken();
    const tokenHash = await bcrypt.hash(tokenPlain, 10);

    await VerificationToken.create({
      user: user._id,
      token: tokenHash,
      expiresAt
    });

    const base = process.env.APP_BASE_URL || "http://localhost:3000";
    const link = `${base}/verify-email?token=${tokenPlain}&email=${encodeURIComponent(user.email)}`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: "Verify your LeapMentor email",
      text: `Click to verify your email:\n${link}\n\nThis link expires in 10 minutes.`,
    });

    return res.json({ message: "Verification link sent to email" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/verification/verify-otp
 * Body: { email, otp }
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "email and otp are required" });

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const record = await VerificationToken.findOne({ user: user._id });
    if (!record) return res.status(400).json({ message: "No verification request found" });

    if (record.expiresAt < new Date()) {
      await VerificationToken.deleteMany({ user: user._id });
      return res.status(400).json({ message: "OTP expired. Please resend." });
    }

    if (!record.otp) {
      return res.status(400).json({ message: "OTP verification not available for this request" });
    }

    const ok = await bcrypt.compare(String(otp).trim(), record.otp);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    user.isEmailVerified = true;
    await user.save();

    await VerificationToken.deleteMany({ user: user._id });

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/verification/verify/:token
 * Query: ?email=someone@example.com
 *
 * (This is for link verification. Your frontend can call this endpoint after user clicks link.)
 */
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = req.query;

    if (!token || !email) {
      return res.status(400).json({ message: "token and email are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const record = await VerificationToken.findOne({ user: user._id });
    if (!record) return res.status(400).json({ message: "No verification request found" });

    if (record.expiresAt < new Date()) {
      await VerificationToken.deleteMany({ user: user._id });
      return res.status(400).json({ message: "Verification link expired. Please resend." });
    }

    if (!record.token) {
      return res.status(400).json({ message: "Link verification not available for this request" });
    }

    const ok = await bcrypt.compare(String(token).trim(), record.token);
    if (!ok) return res.status(400).json({ message: "Invalid verification token" });

    user.isEmailVerified = true;
    await user.save();

    await VerificationToken.deleteMany({ user: user._id });

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/verification/resend
 * Body: { email, method: "otp"|"link" }
 *
 * Just calls the same logic as /send (kept separate endpoint for clarity)
 */
router.post("/resend", async (req, res) => {
  try {
    // reuse send by forwarding to same handler pattern
    const { email, method } = req.body;
    req.body = { email, method };
    // quick inline call: just duplicate minimal logic by calling /send endpoint is not possible here directly
    // simplest: respond telling user to call /send (but you asked routes only), so we just do same as send:

    if (!email) return res.status(400).json({ message: "email is required" });

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const chosen = method === "link" ? "link" : "otp";
    await VerificationToken.deleteMany({ user: user._id });

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (chosen === "otp") {
      const otpPlain = makeOtp();
      const otpHash = await bcrypt.hash(otpPlain, 10);

      await VerificationToken.create({ user: user._id, otp: otpHash, expiresAt });

      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: "LeapMentor Email Verification OTP (Resend)",
        text: `Your OTP is: ${otpPlain}\nIt expires in 10 minutes.`,
      });

      return res.json({ message: "OTP resent to email" });
    }

    const tokenPlain = makeLinkToken();
    const tokenHash = await bcrypt.hash(tokenPlain, 10);

    await VerificationToken.create({ user: user._id, token: tokenHash, expiresAt });

    const base = process.env.APP_BASE_URL || "http://localhost:3000";
    const link = `${base}/verify-email?token=${tokenPlain}&email=${encodeURIComponent(user.email)}`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: "Verify your LeapMentor email (Resend)",
      text: `Click to verify your email:\n${link}\n\nThis link expires in 10 minutes.`,
    });

    return res.json({ message: "Verification link resent to email" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
