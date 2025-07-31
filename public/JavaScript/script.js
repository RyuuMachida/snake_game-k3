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
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.textContent = "Logout";
      loginBtn.onclick = () => {
        localStorage.removeItem("user");
        location.reload();
      };
    }

    // Tombol register jadi My Profile
    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
      registerBtn.textContent = "My Profile";
      registerBtn.onclick = () => window.location.href = "profile.html";
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
