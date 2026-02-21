require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const connectDB = require("./config/db");
const app = express();
app.use(express.json());

connectDB();

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
