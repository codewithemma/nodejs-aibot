const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  picture: String,
  refreshToken: String, // Optional, for offline access
});

const User = mongoose.model("User", userSchema);
module.exports = User;
