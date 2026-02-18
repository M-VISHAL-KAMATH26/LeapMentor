const mongoose = require("mongoose");

const TERMS_LATEST = {
  termsVersion: "1.0",
  privacyVersion: "1.0",
};

const TermsAcceptanceSchema = new mongoose.Schema(
  {
    termsVersion: { type: String, required: true },
    privacyVersion: { type: String, required: true },
    acceptedAt: { type: Date, required: true, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    // identity
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    emailVerified: { type: Boolean, default: false },
    name: { type: String, trim: true },

    // if you also support password login (optional)
    passwordHash: { type: String, select: false },

    // roles
    roles: {
      type: [String],
      enum: ["mentor", "mentee"],
      default: ["mentee"],
      index: true,
    },

    // onboarding progress per role (optional but handy)
    onboarding: {
      mentor: {
        status: { type: String, enum: ["pending", "done"], default: "pending" },
        completedAt: { type: Date },
      },
      mentee: {
        status: { type: String, enum: ["pending", "done"], default: "pending" },
        completedAt: { type: Date },
      },
    },

    // role-specific profiles (add fields later)
    mentorProfile: {
      headline: { type: String, trim: true },
      bio: { type: String, trim: true },
      expertise: [{ type: String, trim: true }],
    },
    menteeProfile: {
      goals: [{ type: String, trim: true }],
      interests: [{ type: String, trim: true }],
    },

    // Terms acceptance (current + history if needed)
    termsAcceptance: {
      current: { type: TermsAcceptanceSchema, default: null },
      history: { type: [TermsAcceptanceSchema], default: [] },
    },

    // basic status flags
    isBlocked: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Ensure unique email
UserSchema.index({ email: 1 }, { unique: true });

// Helpful method: ensure terms accepted for latest versions
UserSchema.methods.hasAcceptedLatestTerms = function hasAcceptedLatestTerms() {
  const current = this.termsAcceptance?.current;
  if (!current) return false;
  return (
    current.termsVersion === TERMS_LATEST.termsVersion &&
    current.privacyVersion === TERMS_LATEST.privacyVersion
  );
};

// Helper: add a role safely
UserSchema.methods.addRole = function addRole(role) {
  if (!["mentor", "mentee"].includes(role)) return;
  const set = new Set(this.roles);
  set.add(role);
  this.roles = Array.from(set);
};

module.exports = mongoose.model("User", UserSchema);
