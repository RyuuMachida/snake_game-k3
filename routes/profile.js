const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

// Setup Multer untuk upload foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// GET /me (ambil data user yang sedang login)
router.get("/me", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Belum login" });

  const user = await User.findById(req.session.userId);
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  res.json({
    username: user.username,
    profilePhoto: user.profilePhoto
  });
});

// PUT /api/profile (update username & password)
router.put("/api/profile", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Belum login" });

  const { newUsername, newPassword } = req.body;
  const update = {};
  if (newUsername) update.username = newUsername;
  if (newPassword) update.password = newPassword;

  await User.findByIdAndUpdate(req.session.userId, update);
  res.json({ message: "Profil berhasil diperbarui" });
});

// POST /api/upload-photo
router.post("/api/upload-photo", upload.single("photo"), async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Belum login" });

  const photoUrl = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.session.userId, { profilePhoto: photoUrl });

  res.json({ photoUrl });
});

module.exports = router;
