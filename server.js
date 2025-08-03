const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('public/uploads'));
app.use(session({
  secret: 'rahasia-super-aman',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true jika pakai HTTPS
}));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Serve halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔐 Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username dan password wajib diisi" });

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(409).json({ message: "Username sudah digunakan" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: "Registrasi berhasil" });
});

// 🔑 Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Password salah" });

  req.session.userId = user._id;

  res.status(200).json({
    success: true,
    message: "Login berhasil",
    user: {
      username: user.username,
      profilePhoto: user.profilePhoto
    }
  });
});

// 👤 Get profile
app.get("/me", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(req.session.userId);
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  res.json({
    username: user.username,
    profilePhoto: user.profilePhoto
  });
});

// ✏️ Update profile (username & password)
app.put("/api/profile", async (req, res) => {
  const { newUsername, newPassword } = req.body;
  if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });

  const update = {};
  if (newUsername) update.username = newUsername;
  if (newPassword) update.password = await bcrypt.hash(newPassword, 10);

  try {
    await User.findByIdAndUpdate(req.session.userId, update);
    res.json({ message: "Profil berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui profil", error: err.message });
  }
});

// 📸 Upload/update profile photo
app.post("/api/upload-photo", upload.single("photo"), async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(req.session.userId);
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  // Hapus foto lama jika ada
  if (user.profilePhoto && fs.existsSync("public" + user.profilePhoto)) {
    fs.unlinkSync("public" + user.profilePhoto);
  }

  const photoUrl = "/uploads/" + req.file.filename;
  user.profilePhoto = photoUrl;
  await user.save();

  res.json({ message: "Foto berhasil diupload", photoUrl });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
