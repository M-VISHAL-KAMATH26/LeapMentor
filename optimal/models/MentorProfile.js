// models/MentorProfile.js
const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema(
  {
    // ✅ Link to User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per mentor
    },

    // ✅ Core Identity
    headline: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    profilePhoto: {
      type: String, // URL
      default: "",
    },

    // ✅ Mentor Showcase (BRD)
    industry: {
      type: String,
      trim: true,
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 60,
    },

    currentRole: {
      type: String,
      trim: true,
    },

    currentCompany: {
      type: String,
      trim: true,
    },

    // ✅ Skills (BRD)
    coreSkills: {
      type: [String],
      default: [],
    },

    expertiseAreas: {
      type: [String],
      default: [],
    },

    // ✅ Social Links (BRD)
    linkedInUrl: {
      type: String,
      trim: true,
      default: "",
    },

    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },

    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },

    twitterUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ Mentorship Preferences
    mentorshipStyle: {
      type: String,
      enum: ["1-on-1", "Group", "Both", ""],
      default: "",
    },

    availabilityHours: {
      type: Number,
      min: 0,
      max: 40,
      default: 0,
    },

    preferredCommunication: {
      type: String,
      enum: ["Video Call", "Chat", "Email", ""],
      default: "",
    },

    languages: {
      type: [String],
      default: ["English"],
    },

    // ✅ Onboarding / Visibility Status
    isProfileComplete: {
      type: Boolean,
      default: false, // false until mentor finishes onboarding form
    },

    isPublished: {
      type: Boolean,
      default: false, // false until profile is ready to show in listings
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);