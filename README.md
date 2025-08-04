# Snake Game K3 🎮

Sebuah **Snake Game modern** yang dibangun menggunakan HTML, CSS, dan JavaScript — lengkap dengan musik latar, kontrol media, menu navigasi, dan UI yang responsif.

---

## 🧩 Fitur

- 🎮 Gameplay **ular klasik**: makan makanan untuk bertambah panjang, hindari menabrak dinding atau tubuh sendiri.
- 🎵 **Background music** dengan kontrol Play / Pause / Next / Previous.
- 📱 **Media session API** untuk kontrol dari lock screen atau notifikasi perangkat.
- 🖼️ **Menu samping (sidebar)** animasi dengan tombol hamburger → X, muncul dari kanan layar.
- 👤 Tampilan profil pengguna (username & foto) yang disimpan di localStorage.
- 🎛️ Navigasi sederhana: Panduan, Reviewer, Social Media Dev.

---

## 🚀 Cara Menjalankan

1. Clone repo ini:
   ```bash
   git clone https://github.com/RyuuMachida/snake_game‑k3.git
   cd snake_game‑k3
Buka index.html di browser.

Mulai permainan dengan mengklik tombol Mulai Main.

🧱 Struktur Direktori
markdown
Copy code
/ (root)
├── index.html
├── Style/
│   └── style.css
└── JavaScript/
    └── script.js
index.html → Halaman utama

Style/style.css → Semua styling UI

JavaScript/script.js → Logika game + audio + media session + sidebar

🔧 Detil Fitur
🕹️ Permainan
Logika dasar Snake Game: kontrol arah dengan panah keyboard atau WASD, scoring, game over otomatis saat tabrakan.

🎶 Audio & Playlist
Playlist musik otomatis berganti track saat lagu selesai. Judul lagu ditampilkan di UI Now Playing, dan perpindahan otomatis juga memperbarui judulnya.

📱 Media Session API
Dukungan kontrol Play/Pause/Next/Previous dari lock-screen atau panel kontrol sistem.

🧭 Sidebar Navigasi
Menu muncul dari kanan layar saat ikon hamburger diklik. Ikon berubah menjadi "X". Menu menutup saat diklik lagi. Navigasi responsif dan smooth.

👨‍💻 Profil User
User disimpan di localStorage — nama & foto muncul di navbar saat login. Logout menghapus user.

📝 Contoh Kode HTML Navbar dengan Sidebar & Hamburger
html
Copy code
<nav>
  <div class="nav-left">
    <div id="hamburger" class="hamburger"><span></span><span></span><span></span></div>
    <img id="userProfilePic" src="default-logo.png" alt="profile">
    <span id="greeting">Halo, Guest!</span>
  </div>
  <div class="nav-right">
    <button id="loginBtn">Register</button>
    <button id="registerBtn">Login</button>
  </div>
</nav>
<div id="sidebarMenu" class="sidebar">
  <ul>
    <li><a href="#">Panduan</a></li>
    <li><a href="#">Reviewer</a></li>
    <li><a href="#">Social Media Dev</a></li>
  </ul>
</div>
📁 Pengembangan
Tambahkan commit detail di script.js untuk fitur baru seperti shuffle, repeat, atau visualisasi musik.

Bisa tambahkan overlay gelap (.overlay) saat menu muncul dan otomatis menutup saat klik area luar.

🤝 Kontribusi
Bebas untuk fork dan modifikasi! Kalau kamu menambah fitur besar, silakan ajukan PR atau diskusi dulu agar sinkron dengan codebase.

🧾 Lisensi
Lisensi MIT — bebas digunakan, modifikasi, dan distribusikan dengan syarat menyertakan atribusi.

✨ Semoga enjoy bermain dan mengembangkan Snake Game K3 ini! ✨

yaml
Copy code

---

### 🧠 Tips Tambahan:
- Tambahkan badge CI atau screenshot gameplay.
- Lampirkan contoh file audio dan artwork.
- Tambahkan instruksi deploy jika kamu host ke GitHub Pages.

Kalau kamu ingin konten README yang lebih lengkap—misalnya dokumentasi game logic, referensi keyboard control, atau cara build ke aplikasi mobile—tinggal bilang ya!
::contentReference[oaicite:0]{index=0}
