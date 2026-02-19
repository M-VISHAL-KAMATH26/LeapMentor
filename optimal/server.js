require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ===========================
   🔹 MIDDLEWARE
=========================== */

// Explicit CORS helps debug origin issues on corporate networks
// Change this
app.use(cors());

// To this
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Fix for Google OAuth popup issue
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

/* ===========================
   🔹 DATABASE CONNECTION
=========================== */
// Note: In 2026, most use the simplified connection string
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));


/* ===========================
   🔹 ROUTES
=========================== */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/verification", require("./routes/verification.routes"));

app.get("/", (req, res) => res.send("🚀 LeapMentor API Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  // This line will tell you if the company laptop is actually seeing the ID
  console.log(`📡 Using Client ID: ${process.env.GOOGLE_CLIENT_ID ? "LOADED" : "NOT FOUND"}`);
});