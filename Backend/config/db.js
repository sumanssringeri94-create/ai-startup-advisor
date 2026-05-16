// config/db.js
// ─────────────────────────────────────────────
// Connects to MongoDB using the URI from .env
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options silence deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure so the app doesn't run without a DB
    process.exit(1);
  }
};

module.exports = connectDB;
