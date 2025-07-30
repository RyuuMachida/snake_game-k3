const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: '/uploads/default-logo.png'}
});

module.exports = mongoose.model("User", userSchema);
