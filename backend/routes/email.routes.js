const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const User = require("../models/User.model");
const EmailVerification = require("../models/EmailVerification.model");
const { sendMail } = require("./_mail");

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function maskEmail(email) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const maskedName = name.length <= 2 ? name[0] + "*" : name.slice(0, 2) + "***";
  return `${maskedName}@${domain}`;
}

/**
 * POST /api/email/send-otp
 * Body: { email }
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = makeOtp();
    const secretHash = sha256(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await EmailVerification.create({
      email,
      type: "otp",
      secretHash,
      expiresAt,
      purpose: "verify_email",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await sendMail({
      to: email,
      subject: "Your verification code",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5">
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</div>
          <p>This code expires in <b>10 minutes</b>.</p>
          <p>If you didn’t request this, ignore this email.</p>
        </div>
      `,
    });

    return res.json({ message: `OTP sent to ${maskEmail(email)}` });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/email/verify-otp
 * Body: { email, otp }
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "email and otp are required" });

    const secretHash = sha256(String(otp));

    const record = await EmailVerification.findOne({
      email,
      type: "otp",
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .select("+secretHash");

    if (!record) return res.status(400).json({ message: "OTP expired or not found" });

    if (record.attempts >= record.maxAttempts) {
      return res.status(429).json({ message: "Too many attempts. Request a new OTP." });
    }

    if (record.secretHash !== secretHash) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    record.consumedAt = new Date();
    await record.save();

    // mark verified (create user if doesn't exist is optional; here we just update if exists)
    await User.findOneAndUpdate(
      { email },
      { $set: { emailVerified: true } },
      { new: true }
    );

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/email/send-link
 * Body: { email }
 */
router.post("/send-link", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const token = crypto.randomBytes(32).toString("hex");
    const secretHash = sha256(token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await EmailVerification.create({
      email,
      type: "magiclink",
      secretHash,
      expiresAt,
      purpose: "verify_email",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(
      email
    )}&token=${encodeURIComponent(token)}`;

    await sendMail({
      to: email,
      subject: "Verify your email",
      text: `Verify your email: ${verifyUrl} (expires in 30 minutes)`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your email (expires in 30 minutes):</p>
          <p>
            <a href="${verifyUrl}"
               style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
              Verify Email
            </a>
          </p>
          <p>If the button doesn’t work, paste this link into your browser:</p>
          <p>${verifyUrl}</p>
        </div>
      `,
    });

    return res.json({ message: `Magic link sent to ${maskEmail(email)}` });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/email/verify-link?email=...&token=...
 * (Your frontend can call this, or you can call from browser)
 */
router.get("/verify-link", async (req, res) => {
  try {
    const { email, token } = req.query;
    if (!email || !token) return res.status(400).json({ message: "email and token are required" });

    const secretHash = sha256(String(token));

    const record = await EmailVerification.findOne({
      email,
      type: "magiclink",
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .select("+secretHash");

    if (!record) return res.status(400).json({ message: "Link expired or not found" });
    if (record.secretHash !== secretHash) return res.status(400).json({ message: "Invalid link" });

    record.consumedAt = new Date();
    await record.save();

    await User.findOneAndUpdate(
      { email },
      { $set: { emailVerified: true } },
      { new: true }
    );

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
