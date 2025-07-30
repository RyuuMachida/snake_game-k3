const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const path = require("path");

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));

// Route untuk halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 📦 MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
  
// 📷 Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.put('/api/profile/:username', async (req, res) => {
  const { username } = req.params;
  const { newUsername, newPassword } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (newUsername) user.username = newUsername;
  if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

  await user.save();
  res.json({ message: "Profile updated" });
});


// 📝 Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(409).json({ message: "Username already exists" });

  const newUser = new User({ username, password });

  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

// 🔐 Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = password === user.password;
  if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      username: user.username,
      photo: user.photo
    }
  });
});

// 📤 Upload / change profile photo
app.post('/api/upload-photo/:username', upload.single('photo'), async (req, res) => {
  const { username } = req.params;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : "";

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Hapus foto lama jika ada
  if (user.photo && fs.existsSync("." + user.photo)) {
    fs.unlinkSync("." + user.photo);
  }

  user.photo = photoPath;
  await user.save();

  res.json({ message: "Profile photo updated", photo: photoPath });
});

// 🟢 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
