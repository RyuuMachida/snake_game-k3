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
  }
});

const bgMusic = document.getElementById("bgMusic");
const toggleMusicBtn = document.getElementById("toggleMusicBtn");
let musicPlaying = false;

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
