// controllers/mentorProfile.controller.js
const MentorProfile = require("../models/MentorProfile");

/**
 * POST /api/mentor-profile
 * Create mentor profile (onboarding form submission)
 */
const createProfile = async (req, res) => {
  try {
    const existing = await MentorProfile.findOne({ user: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "Profile already exists. Use update instead." });
    }

    const {
      headline,
      bio,
      profilePhoto,
      industry,
      yearsOfExperience,
      currentRole,
      currentCompany,
      coreSkills,
      expertiseAreas,
      linkedInUrl,
      portfolioUrl,
      githubUrl,
      twitterUrl,
      mentorshipStyle,
      availabilityHours,
      preferredCommunication,
      languages,
    } = req.body;

    const profile = await MentorProfile.create({
      user: req.user._id,
      headline,
      bio,
      profilePhoto,
      industry,
      yearsOfExperience,
      currentRole,
      currentCompany,
      coreSkills: coreSkills || [],
      expertiseAreas: expertiseAreas || [],
      linkedInUrl,
      portfolioUrl,
      githubUrl,
      twitterUrl,
      mentorshipStyle,
      availabilityHours,
      preferredCommunication,
      languages: languages || ["English"],
      isProfileComplete: true,  // mark complete on first submission
      isPublished: true,        // auto-publish on creation
    });

    return res.status(201).json({
      message: "Mentor profile created successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/mentor-profile/me
 * Get logged-in mentor's own profile
 */
const getMyProfile = async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({ user: req.user._id })
      .populate("user", "name email isEmailVerified");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
        isProfileComplete: false, // ✅ frontend uses this to redirect to onboarding
      });
    }

    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/mentor-profile/me
 * Update logged-in mentor's own profile
 */
const updateProfile = async (req, res) => {
  try {
    const profile = await MentorProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/mentor-profile/:id
 * Get any mentor's public profile by userId
 */
const getPublicProfile = async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({
      user: req.params.id,
      isPublished: true,
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
  getPublicProfile,
};