const board = document.getElementById("gameBoard");
const scoreText = document.getElementById("score");
const topScoreText = document.getElementById("topScore");
const makanSound = new Audio("makan.mp3");
const gameOverSound = new Audio("gameover.mp3");

const boardSize = 20;
let snake = []; // Array posisi snake
let direction = 1; // Arah awal ke kanan
let isPaused = false; // Status pause
let food = 0; // Posisi makanan
let foodType = null; // Tipe makanan
let score = 0; // Skor awal
let intervalTime = 130; // Kecepatan awal
let gameInterval = null; // Interval loop utama
let topScore = localStorage.getItem("topScore") || 0; // Ambil top score dari localStorage

topScoreText.textContent = "Top Score: " + topScore;
let eatCount = 0; // Jumlah makanan yang dimakan (untuk reset musuh)

const fruits = [ // Daftar buah dengan warna & efek tumbuh
  { name: "Strawberry", color: "#f43f5e", grow: 1 },
  { name: "Banana", color: "#facc15", grow: 1 },
  { name: "Blueberry", color: "#3b82f6", grow: 1 },
  { name: "Grape", color: "#9333ea", grow: 1 },
  { name: "Orange", color: "#fb923c", grow: 1 },
  { name: "Watermelon", color: "#10b981", grow: 1 },
  { name: "Dragonfruit", color: "#ec4899", grow: 1 }
];

// === Tambahan: Musuh & Rintangan ===
let enemy = null; // Posisi musuh
let obstacles = []; // Posisi rintangan

function drawBoard() { // Gambar ulang papan permainan
  board.innerHTML = "";
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (snake.includes(i)) cell.classList.add("snake");
    if (i === enemy) cell.classList.add("enemy");
    if (obstacles.includes(i)) cell.classList.add("obstacle");

    if (i === food && foodType) {
      cell.style.backgroundColor = foodType.color;
      cell.title = foodType.name;
    }

    board.appendChild(cell);
  }
}

function placeFood() { // Tempatkan makanan di posisi random
  do {
    food = Math.floor(Math.random() * boardSize * boardSize);
  } while (snake.includes(food) || obstacles.includes(food) || food === enemy);

  const randomIndex = Math.floor(Math.random() * fruits.length);
  foodType = fruits[randomIndex];
}

function isTooClose(pos1, pos2, minDistance = 2) { // Cek jarak antar posisi
  const x1 = pos1 % boardSize;
  const y1 = Math.floor(pos1 / boardSize);
  const x2 = pos2 % boardSize;
  const y2 = Math.floor(pos2 / boardSize);
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) <= minDistance;
}

function placeEnemy() { // Tempatkan musuh di posisi aman
  let tries = 0;
  do {
    enemy = Math.floor(Math.random() * boardSize * boardSize);
    tries++;
    if (tries > 100) break;
  } while (
    snake.includes(enemy) ||
    obstacles.includes(enemy) ||
    enemy === food ||
    isTooClose(enemy, snake[0], 3)
  );
}

function placeObstacles() { // Tempatkan rintangan secara acak
  obstacles = [];
  const totalObstacles = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < totalObstacles; i++) {
    let pos, tries = 0;
    do {
      pos = Math.floor(Math.random() * boardSize * boardSize);
      tries++;
      if (tries > 100) break;
    } while (
      obstacles.includes(pos) ||
      snake.includes(pos) ||
      pos === food ||
      pos === enemy ||
      isTooClose(pos, snake[0], 2)
    );
    obstacles.push(pos);
  }
}

function moveEnemy() { // Gerakkan musuh mendekati kepala snake
  if (enemy === null) return;

  const head = snake[0];
  const dx = head % boardSize - enemy % boardSize;
  const dy = Math.floor(head / boardSize) - Math.floor(enemy / boardSize);

  const directions = [];

  if (dx > 0) directions.push(1); // Kanan
  if (dx < 0) directions.push(-1); // Kiri
  if (dy > 0) directions.push(boardSize); // Bawah
  if (dy < 0) directions.push(-boardSize); // Atas

  directions.push(1, -1, boardSize, -boardSize); // Fallback

  for (let dir of directions) {
    const next = enemy + dir;
    const isValid =
      next >= 0 &&
      next < boardSize * boardSize &&
      !snake.includes(next) &&
      !obstacles.includes(next) &&
      next !== food;

    if (isValid) {
      enemy = next;
      break;
    }
  }
}

function moveSnake() { // Fungsi utama untuk gerak ular
  const head = snake[0];
  let newHead = head + direction;

  const hitRight = direction === 1 && head % boardSize === boardSize - 1;
  const hitLeft = direction === -1 && head % boardSize === 0;
  const hitBottom = direction === boardSize && head >= boardSize * (boardSize - 1);
  const hitTop = direction === -boardSize && head < boardSize;

  if (
    hitRight || hitLeft || hitBottom || hitTop ||
    snake.includes(newHead) ||
    newHead === enemy ||
    obstacles.includes(newHead)
  ) return gameOver();

  snake.unshift(newHead); // Tambah kepala baru

  if (newHead === food) { // Makan makanan
    score += foodType.grow;
    eatCount++;
    scoreText.textContent = `Score: ${score} (${foodType.name})`;

    makanSound.currentTime = 0;
    makanSound.play();

    if (score > topScore) {
      topScore = score;
      localStorage.setItem("topScore", topScore);
      topScoreText.textContent = "Top Score: " + topScore;
    }

    if (eatCount >= 2 && enemy !== null) resetEnemy();

    updateLevel();
    placeFood();
    placeObstacles(); // Ganti kayu tiap makan

  } else {
    snake.pop(); // Hapus ekor
  }

  moveEnemy(); // Gerakkan musuh
  drawBoard(); // Gambar ulang papan
}

function resetEnemy() { // Reset musuh (hilangkan)
  enemy = null;
}

function changeDirection(e) { // Ubah arah berdasarkan input keyboard
  if (isPaused) return;

  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      setDirection(-boardSize); break;
    case "ArrowDown":
    case "s":
    case "S":
      setDirection(boardSize); break;
    case "ArrowLeft":
    case "a":
    case "A":
      setDirection(-1); break;
    case "ArrowRight":
    case "d":
    case "D":
      setDirection(1); break;
  }
}

function startGame() { // Mulai permainan baru
  if (gameInterval) clearInterval(gameInterval);

  isPaused = false;
  snake = [210];
  direction = 1;
  score = 0;
  eatCount = 0;
  enemy = null;
  placeObstacles();
  placeFood();
  drawBoard();
  gameInterval = setInterval(moveSnake, intervalTime);

  const startBtn = document.getElementById("startButton");
  startBtn.textContent = "Pause";
  startBtn.onclick = togglePause;
}

document.addEventListener("keydown", function (e) { // Event keyboard
  const key = e.key;
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!gameInterval && !isPaused && (arrowKeys.includes(key) || key === "Enter")) {
    startGame();
  }
  changeDirection(e);
});

function setDirection(newDir) { // Ubah arah snake jika tidak mundur
  if (isPaused) return;
  if (!gameInterval && !isPaused) startGame();
  if (direction !== -newDir) direction = newDir;
}

function restartGame() { // Ulang permainan
  document.getElementById("pausePopup").style.display = "none";
  let newLevel = 1;
  clearInterval(gameInterval);
  score = 0;
  scoreText.textContent = "Score: 0";
  startGame();
}

function gameOver() { // Saat game over
  clearInterval(gameInterval);
  gameOverSound.currentTime = 0;
  gameOverSound.play();
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOverPopup").style.display = "flex";
}

function hidePopup() { // Sembunyikan popup game over
  document.getElementById("gameOverPopup").style.display = "none";
}

let level = 1;
let levelDisplay = document.getElementById("levelDisplay");
let winPopup = document.getElementById("winPopup");

function updateLevel() { // Update level dan kecepatan berdasarkan skor
  if (score >= 50) {
    clearInterval(gameInterval);
    winPopup.style.display = "flex";
    return;
  }

  let newLevel = 1;
  let newSpeed = 130;

  if (score >= 25) { newLevel = 5; newSpeed = 130 * 0.2; }
  else if (score >= 20) { newLevel = 4; newSpeed = 130 * 0.5; }
  else if (score >= 15) { newLevel = 3; newSpeed = 130 * 0.7; }
  else if (score >= 10) { newLevel = 2; newSpeed = 130 * 0.9; }

  if (newLevel !== level) {
    level = newLevel;
    intervalTime = newSpeed;
    placeEnemy();
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, intervalTime);
  }

  levelDisplay.innerText = "Level: " + level;
}

function continueGame() { // Lanjutkan ke permainan berikutnya
  winPopup.style.display = "none";
  restartGame();
}

function togglePause() { // Pause atau lanjut
  const pausePopup = document.getElementById("pausePopup");
  const startBtn = document.getElementById("startButton");

  if (isPaused) {
    gameInterval = setInterval(moveSnake, intervalTime);
    pausePopup.style.display = "none";
    startBtn.textContent = "Pause";
    isPaused = false;
  } else {
    clearInterval(gameInterval);
    pausePopup.style.display = "flex";
    startBtn.textContent = "Resume";
    isPaused = true;
  }
}
