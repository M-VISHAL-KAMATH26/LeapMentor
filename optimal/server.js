require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ===========================
   🔹 MIDDLEWARE
=========================== */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ===========================
   🔹 MONGODB ATLAS CONNECTION
=========================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });


/* ===========================
   🔹 ROUTES
=========================== */

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/verification", require("./routes/verification.routes"));


/* ===========================
   🔹 HEALTH CHECK ROUTE
=========================== */

app.get("/", (req, res) => {
  res.send("🚀 LeapMentor Backend API Running...");
});


/* ===========================
   🔹 SERVER START
=========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
