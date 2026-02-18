const mongoose = require("mongoose");

const AuthProviderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    provider: {
      type: String,
      enum: ["google", "linkedin", "apple"],
      required: true,
      index: true,
    },

    // provider user id (sub)
    providerUserId: { type: String, required: true, index: true },

    // tokens (optional) - store only if you truly need them
    accessToken: { type: String, select: false },
    refreshToken: { type: String, select: false },
    tokenExpiresAt: { type: Date },

    // profile snapshot (optional)
    email: { type: String, lowercase: true, trim: true },
    displayName: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

// One provider account should map to one user
AuthProviderSchema.index({ provider: 1, providerUserId: 1 }, { unique: true });

// A user can connect each provider once
AuthProviderSchema.index({ userId: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model("AuthProvider", AuthProviderSchema);
