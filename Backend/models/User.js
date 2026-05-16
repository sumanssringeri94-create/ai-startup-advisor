// models/User.js
// ─────────────────────────────────────────────
// Schema for registered users
// Fields: name, email, password (hashed), createdAt
// ─────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,          // no duplicate emails
      lowercase: true,       // store as lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,         // never return password in queries by default
    },
  },
  {
    timestamps: true,        // adds createdAt & updatedAt automatically
  }
);

// ── Pre-save hook: hash password before saving ────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash if the password field was actually changed
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12); // 12 rounds = secure + fast enough
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare plain password with stored hash ─────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
