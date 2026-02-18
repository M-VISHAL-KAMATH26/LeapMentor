const mongoose = require("mongoose");

const EmailVerificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },

    // If user already exists, link it (optional)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    // "otp" or "magiclink"
    type: { type: String, enum: ["otp", "magiclink"], required: true, index: true },

    // store ONLY hashed value
    secretHash: { type: String, required: true, select: false },

    // security controls
    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date, default: null },

    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },

    // optional metadata
    ipAddress: { type: String },
    userAgent: { type: String },
    purpose: {
      type: String,
      enum: ["verify_email", "login", "signup"],
      default: "verify_email",
      index: true,
    },
  },
  { timestamps: true }
);

// TTL cleanup (Mongo will delete docs after expiresAt)
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent many active codes of same type for same email (optional, but helpful)
EmailVerificationSchema.index({ email: 1, type: 1, purpose: 1, consumedAt: 1 });

module.exports = mongoose.model("EmailVerification", EmailVerificationSchema);
