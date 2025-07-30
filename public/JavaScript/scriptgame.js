const board = document.getElementById("gameBoard");
const scoreText = document.getElementById("score");
const topScoreText = document.getElementById("topScore");

const boardSize = 20;
let snake = [];
let direction = 1;
let food = 0;
let foodType = null;
let score = 0;
let intervalTime = 100; // lebih lambat 20%
let gameInterval = null;
let topScore = localStorage.getItem("topScore") || 0;

topScoreText.textContent = "Top Score: " + topScore;
let maxLength = 70; // maksimal panjang snake

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
  const key = e.key;
  if (key === "ArrowUp" && direction !== boardSize) direction = -boardSize;
  else if (key === "ArrowDown" && direction !== -boardSize) direction = boardSize;
  else if (key === "ArrowLeft" && direction !== 1) direction = -1;
  else if (key === "ArrowRight" && direction !== -1) direction = 1;
}

function startGame() {
  if (gameInterval) clearInterval(gameInterval);

  snake = [210];
  direction = 1;
  score = 0;
  scoreText.textContent = "Score: 0";
  placeFood();
  drawBoard();
  gameInterval = setInterval(moveSnake, intervalTime);

  // Ubah tombol menjadi "Restart"
  const startBtn = document.getElementById("startButton");
  startBtn.textContent = "Restart";
  startBtn.onclick = restartGame;

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
  if (!gameInterval && (arrowKeys.includes(key) || key === "Enter")) {
    startGame();
  }

  // Ganti arah seperti biasa
  changeDirection(e);
});


function restartGame() {
  clearInterval(gameInterval);
  score = 0;
  scoreText.textContent = "Score: 0";
  startGame();
}
function gameOver() {
  clearInterval(gameInterval);
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
  let newSpeed = 100;

  if (score >= 40) {
    newLevel = 5;
    newSpeed = 100 * 0.2; // 75% faster
  } else if (score >= 30) {
    newLevel = 4;
    newSpeed = 100 * 0.5;
  } else if (score >= 20) {
    newLevel = 3;
    newSpeed = 100 * 0.7;
  } else if (score >= 10) {
    newLevel = 2;
    newSpeed = 100 * 0.9;
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
