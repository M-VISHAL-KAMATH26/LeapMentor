const express = require("express");

const authRoutes = require("./auth.routes");
const emailRoutes = require("./email.routes");
const termsRoutes = require("./terms.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.get("/health", (req, res) => res.json({ ok: true }));

router.use("/auth", authRoutes);
router.use("/email", emailRoutes);
router.use("/terms", termsRoutes);
router.use("/users", userRoutes);

module.exports = router;
