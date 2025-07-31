const board = document.getElementById("gameBoard");
const scoreText = document.getElementById("score");
const topScoreText = document.getElementById("topScore");
const makanSound = new Audio("makan.mp3");
const gameOverSound = new Audio("gameover.mp3");

const boardSize = 20;
let snake = [];
let direction = 1;
let food = 0;
let foodType = null;
let score = 0;
let intervalTime = 115; // lebih lambat 20%
let gameInterval = null;
let topScore = localStorage.getItem("topScore") || 0;

topScoreText.textContent = "Top Score: " + topScore;
let maxLength = 55; // maksimal panjang snake

// Buah-buahan unik
const fruits = [
  { name: "Strawberry", color: "#f43f5e", grow: 1 },
  { name: "Banana", color: "#facc15", grow: 1 },
  { name: "Blueberry", color: "#3b82f6", grow: 1 },
  { name: "Grape", color: "#9333ea", grow: 1 },
  { name: "Orange", color: "#fb923c", grow: 1 },
  { name: "Watermelon", color: "#10b981", grow: 1 },
  { name: "Dragonfruit", color: "#ec4899", grow: 1 }
];

function drawBoard() {
  board.innerHTML = "";
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (snake.includes(i)) {
      cell.classList.add("snake");
    }

    if (i === food && foodType) {
      cell.style.backgroundColor = foodType.color;
      cell.title = foodType.name;
    }

    board.appendChild(cell);
  }
}

function placeFood() {
  do {
    food = Math.floor(Math.random() * boardSize * boardSize);
  } while (snake.includes(food));

  const randomIndex = Math.floor(Math.random() * fruits.length);
  foodType = fruits[randomIndex];
}

function moveSnake() {
  const head = snake[0];
  let newHead = head + direction;

  const hitRight = direction === 1 && head % boardSize === boardSize - 1;
  const hitLeft = direction === -1 && head % boardSize === 0;
  const hitBottom = direction === boardSize && head >= boardSize * (boardSize - 1);
  const hitTop = direction === -boardSize && head < boardSize;

  if (hitRight || hitLeft || hitBottom || hitTop || snake.includes(newHead)) {
    return gameOver();
  }

  snake.unshift(newHead);

  if (newHead === food) {
    score += foodType.grow;
    scoreText.textContent = `Score: ${score} (${foodType.name})`;

    makanSound.currentTime = 0;
    makanSound.play();

    if (score > topScore) {
      topScore = score;
      localStorage.setItem("topScore", topScore);
      topScoreText.textContent = "Top Score: " + topScore;
    }

    updateLevel(); // Tambahkan ini
    placeFood();
  } else {
    snake.pop();
  }

  drawBoard();
}

function changeDirection(e) {
  const key = e.key.toLowerCase(); // Biar "W" dan "w" dianggap sama

  if (isPaused) return;

  if ((key === "arrowup" || key === "w") && direction !== boardSize) {
    direction = -boardSize; // atas
  } else if ((key === "arrowdown" || key === "s") && direction !== -boardSize) {
    direction = boardSize; // bawah
  } else if ((key === "arrowleft" || key === "a") && direction !== 1) {
    direction = -1; // kiri
  } else if ((key === "arrowright" || key === "d") && direction !== -1) {
    direction = 1; // kanan
  }
}

function togglePause() {
  const startBtn = document.getElementById("startButton");
  const pausePopup = document.getElementById("pausePopup");

  if (isPaused) {
    // Resume
    gameInterval = setInterval(moveSnake, intervalTime);
    startBtn.textContent = "Pause";
    isPaused = false;
    pausePopup.style.display = "none";
  } else {
    // Pause
    clearInterval(gameInterval);
    gameInterval = null;
    startBtn.textContent = "Resume";
    isPaused = true;
    pausePopup.style.display = "flex";
  }
}



function startGame() {
  if (gameInterval) clearInterval(gameInterval);

  isPaused = false;

  snake = [210];
  direction = 1;
  score = 0;
  scoreText.textContent = "Score: 0";
  placeFood();
  drawBoard();
  gameInterval = setInterval(moveSnake, intervalTime);

  // Ubah tombol menjadi "Restart"
  const startBtn = document.getElementById("startButton");
  startBtn.textContent = "Pause";
  startBtn.onclick = togglePause;

  function restartGame() {
    clearInterval(gameInterval);
    score = 0;
    scoreText.textContent = "Score: 0";
    startGame(); // Restart = mulai ulang
  }
}

document.addEventListener("keydown", function (e) {
  const key = e.key;

  // Jika belum mulai, mulai otomatis saat tekan arah/enter
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!gameInterval && !isPaused && (arrowKeys.includes(key) || key === "Enter")) {
    startGame();
  }

  // Ganti arah seperti biasa
  changeDirection(e);
});

function setDirection(newDir) {
  if (isPaused) return;

  // Sama seperti keyboard: auto-start hanya kalau belum mulai & tidak pause
  if (!gameInterval && !isPaused) {
    startGame();
  }

  // Hindari gerakan mundur
  if (direction !== -newDir) {
    direction = newDir;
  }
}



function restartGame() {
  document.getElementById("pausePopup").style.display = "none";
  let newLevel = 1;

  clearInterval(gameInterval);
  score = 0;
  scoreText.textContent = "Score: 0";
  startGame();
}
function gameOver() {
  clearInterval(gameInterval);

  gameOverSound.currentTime = 0;
  gameOverSound.play();
  
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOverPopup").style.display = "flex";
}
function hidePopup() {
  document.getElementById("gameOverPopup").style.display = "none";
}
let level = 1;
let levelDisplay = document.getElementById("levelDisplay");
let winPopup = document.getElementById("winPopup");

function updateLevel() {
  if (score >= 50) {
    clearInterval(gameInterval);
    winPopup.style.display = "flex";
    return;
  }

  let newLevel = 1;
  let newSpeed = 115;

  if (score >= 25) {
    newLevel = 5;
    newSpeed = 115 * 0.2; // 75% faster
  } else if (score >= 20) {
    newLevel = 4;
    newSpeed = 115 * 0.5;
  } else if (score >= 15) {
    newLevel = 3;
    newSpeed = 115 * 0.7;
  } else if (score >= 10) {
    newLevel = 2;
    newSpeed = 115 * 0.9;
  }

  if (newLevel !== level) {
    level = newLevel;
    intervalTime = newSpeed;
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, intervalTime);
  }

  levelDisplay.innerText = "Level: " + level;
}
function continueGame() {
  winPopup.style.display = "none";
  restartGame();
}
