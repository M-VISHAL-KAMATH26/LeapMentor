const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const { requireAuth } = require("./_jwt");

const LATEST = {
  termsVersion: "1.0",
  privacyVersion: "1.0",
};

router.get("/latest", (req, res) => res.json(LATEST));

router.post("/accept", requireAuth, async (req, res) => {
  try {
    const { termsVersion, privacyVersion } = req.body;

    if (!termsVersion || !privacyVersion) {
      return res.status(400).json({ message: "termsVersion and privacyVersion required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          "termsAcceptance.current": {
            termsVersion,
            privacyVersion,
            acceptedAt: new Date(),
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
          },
        },
      },
      { new: true }
    );

    return res.json({ message: "Terms accepted", accepted: user.termsAcceptance.current });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
