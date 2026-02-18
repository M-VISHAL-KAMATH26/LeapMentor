const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const { requireAuth } = require("./_jwt");

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/me/roles", requireAuth, async (req, res) => {
  try {
    const { roles } = req.body;
    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ message: "roles must be an array" });
    }

    const cleaned = Array.from(new Set(roles)).filter((r) => ["mentor", "mentee"].includes(r));
    if (cleaned.length === 0) return res.status(400).json({ message: "Invalid roles" });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { roles: cleaned } },
      { new: true }
    );

    return res.json({ message: "Roles updated", roles: user.roles });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/me/mentor-profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { mentorProfile: req.body } },
      { new: true }
    );
    return res.json({ message: "Mentor profile updated", mentorProfile: user.mentorProfile });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/me/mentee-profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { menteeProfile: req.body } },
      { new: true }
    );
    return res.json({ message: "Mentee profile updated", menteeProfile: user.menteeProfile });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
