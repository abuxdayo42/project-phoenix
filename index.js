const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 5000;

// =============================
// Database Connection
// =============================

// IMPORTANT:
// The application expects DATABASE_URI.
// This will be provided later in docker-compose.yml.

const dbUri =
  process.env.DATABASE_URI ||
  "mongodb://localhost:27017/phoenix";

mongoose
  .connect(dbUri)
  .then(() => {
    console.log("✅ Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:");
    console.error(err.message);
  });

// =============================
// Serve React/Vite Frontend
// =============================

// Vite creates a folder named "dist"
// NOT "public"

const uiPath = path.join(__dirname, "dist");

app.use(express.static(uiPath));

// =============================
// API Route
// =============================

app.get("/api/health", (req, res) => {
  res.json({
    status: "API is alive",
  });
});

// =============================
// Serve Frontend
// =============================

app.get("*", (req, res) => {
  res.sendFile(path.join(uiPath, "index.html"));
});

// =============================
// Start Server
// =============================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});