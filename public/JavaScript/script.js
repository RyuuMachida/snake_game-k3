window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    // Ganti sapaan
    const greeting = document.getElementById("greeting");
    if (greeting) {
      greeting.textContent = `Hi, ${user.username}!`;
    }

    // Ganti gambar profil
    const profileImage = document.getElementById("userProfilePic");
    if (profileImage) {
      profileImage.src = user.photo || 'default-logo.png';
    }

    // Tombol login jadi Logout
    const loginBtn = document.getElementById("registerBtn");
    if (loginBtn) {
      loginBtn.textContent = "Logout";
      loginBtn.onclick = () => {
        localStorage.removeItem("user");
        location.reload();
      };
    }

    const registerBtn = document.getElementById("loginBtn");
    if (registerBtn) {
      registerBtn.textContent = ""; // kosongin teks
    } 
  }
});

const bgMusic = document.getElementById("bgMusic");
const toggleMusicBtn = document.getElementById("toggleMusicBtn");

const playlist = [
  {
    src: "JavaScript/Tabola Bale.mp3",
    title: "Tabola Bale",
    artwork: "JavaScript/cover1.png"
  },
  {
    src: "JavaScript/Kasih Aba-aba.mp3",
    title: "Kasih Aba-aba",
    artwork: "JavaScript/cover2.png"
  },
  {
    src: "JavaScript/Calon Mantu Terbaik MamaMu.mp3",
    title: "Calon Mantu Terbaik MamaMu",
    artwork: "JavaScript/cover3.png"
  },
  {
    src: "JavaScript/DJ Laptop.mp3",
    title: "DJ Trend Laptop",
    artwork: "JavaScript/cover4.png"
  }
];


let currentTrack = 0;
let musicPlaying = false;

// Load lagu pertama
bgMusic.src = playlist[currentTrack].src;
updateMediaSession(playlist[currentTrack]);

toggleMusicBtn.addEventListener("click", () => {
  if (musicPlaying) {
    bgMusic.pause();
    toggleMusicBtn.textContent = "🎵 Play Music";
  } else {
    bgMusic.play();
    toggleMusicBtn.textContent = "⏸ Pause Music";
  }
  musicPlaying = !musicPlaying;
});

// Otomatis lanjut ke lagu berikutnya
bgMusic.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  bgMusic.src = playlist[currentTrack].src;
  updateMediaSession(playlist[currentTrack]);
  if (musicPlaying) {
    bgMusic.play();
  }
});

// Atur tampilan media di lockscreen
function updateMediaSession(track) {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: "Snake Game K3",
      album: "Snake Game OST",
      artwork: [
        { src: track.artwork, sizes: "512x512", type: "image/png" }
      ]
    });

    navigator.mediaSession.setActionHandler("play", () => {
      bgMusic.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      bgMusic.pause();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      currentTrack = (currentTrack + 1) % playlist.length;
      bgMusic.src = playlist[currentTrack].src;
      updateMediaSession(playlist[currentTrack]);
      bgMusic.play();
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
      bgMusic.src = playlist[currentTrack].src;
      updateMediaSession(playlist[currentTrack]);
      bgMusic.play();
    });
  }
}
