let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
const main = document.querySelector("main");
const introSound = new Audio("audios/gameIntro.mp3");
const playingSound = new Audio("audios/playing.wav");
playingSound.volume = 0.2;
const ghostSound = new Audio("audios/ghost.mp3");
ghostSound.volume = 0.2;
const enemyHitSound = new Audio("audios/enemyHit.mp3");
enemyHitSound.volume = 0.2;
const deathSound = new Audio("audios/death.wav");
deathSound.volume = 0.2;

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

//Populates the maze in the HTML
for (let y of maze) {
  for (let x of y) {
    let block = document.createElement("div");
    block.classList.add("block");

    switch (x) {
      case 1:
        block.classList.add("wall");
        break;
      case 2:
        block.id = "player";
        let mouth = document.createElement("div");
        mouth.classList.add("mouth");
        block.appendChild(mouth);
        break;
      case 3:
        block.classList.add("enemy");
        break;
      default:
        block.classList.add("point");
        block.style.height = "1vh";
        block.style.width = "1vh";
    }

    main.appendChild(block);
  }
}

//Player movement
function keyUp(event) {
  if (event.key === "ArrowUp") {
    upPressed = false;
  } else if (event.key === "ArrowDown") {
    downPressed = false;
  } else if (event.key === "ArrowLeft") {
    leftPressed = false;
  } else if (event.key === "ArrowRight") {
    rightPressed = false;
  }
}

function keyDown(event) {
  if (event.key === "ArrowUp") {
    upPressed = true;
  } else if (event.key === "ArrowDown") {
    downPressed = true;
  } else if (event.key === "ArrowLeft") {
    leftPressed = true;
  } else if (event.key === "ArrowRight") {
    rightPressed = true;
  }
}
let moveInterval; // Holds the interval for continuous movement

// Function to start movement
function startMovement(direction, intervalTime) {
  moveInterval = setInterval(() => {
    if (direction === "left" && leftPressed) movePlayer("left");
    if (direction === "up" && upPressed) movePlayer("up");
    if (direction === "right" && rightPressed) movePlayer("right");
    if (direction === "down" && downPressed) movePlayer("down");
  }, intervalTime);
}

// Function to stop movement
function stopMovement() {
  clearInterval(moveInterval);
  moveInterval = null;
}
// Left button (lbttn) movement
document.querySelector("#lbttn").addEventListener("mousedown", () => {
  leftPressed = true;
  startMovement("left", 100); // Repeat every 100ms for continuous movement
});
document.querySelector("#lbttn").addEventListener("mouseup", () => {
  leftPressed = false;
  stopMovement();
});
document.querySelector("#lbttn").addEventListener("mouseleave", () => {
  leftPressed = false;
  stopMovement();
});

// Up button (ubttn) movement
document.querySelector("#ubttn").addEventListener("mousedown", () => {
  upPressed = true;
  startMovement("up", 100); // Repeat every 100ms for continuous movement
});
document.querySelector("#ubttn").addEventListener("mouseup", () => {
  upPressed = false;
  stopMovement();
});
document.querySelector("#ubttn").addEventListener("mouseleave", () => {
  upPressed = false;
  stopMovement();
});

// Right button (rbttn) movement
document.querySelector("#rbttn").addEventListener("mousedown", () => {
  rightPressed = true;
  startMovement("right", 100); // Repeat every 100ms for continuous movement
});
document.querySelector("#rbttn").addEventListener("mouseup", () => {
  rightPressed = false;
  stopMovement();
});
document.querySelector("#rbttn").addEventListener("mouseleave", () => {
  rightPressed = false;
  stopMovement();
});

// Down button (dbttn) movement
document.querySelector("#dbttn").addEventListener("mousedown", () => {
  downPressed = true;
  startMovement("down", 100); // Repeat every 100ms for continuous movement
});
document.querySelector("#dbttn").addEventListener("mouseup", () => {
  downPressed = false;
  stopMovement();
});
document.querySelector("#dbttn").addEventListener("mouseleave", () => {
  downPressed = false;
  stopMovement();
});

// Code for wall collision detection
const player = document.querySelector("#player");
const playerMouth = player.querySelector(".mouth");
let playerTop = 0;
let playerLeft = 0;

// Get all the wall elements
const walls = document.querySelectorAll(".wall");

function checkCollision() {
  const playerRect = player.getBoundingClientRect();

  // Check for collisions with walls
  for (let wall of walls) {
    const wallRect = wall.getBoundingClientRect();
    if (
      playerRect.bottom >= wallRect.top &&
      playerRect.top <= wallRect.bottom &&
      playerRect.right >= wallRect.left &&
      playerRect.left <= wallRect.right
    ) {
      return true;
    }
  }

  return false;
}

// Code to remove point from maze and add score
let score = 0;
const scoreElement = document.querySelector(".score p");
const pointElements = document.querySelectorAll(".point"); // Select all point elements

function checkPointCollection() {
  const playerRect = player.getBoundingClientRect();

  pointElements.forEach((point) => {
    if (point.classList.contains("point")) {
      const pointRect = point.getBoundingClientRect();

      if (
        playerRect.bottom >= pointRect.top &&
        playerRect.top <= pointRect.bottom &&
        playerRect.right >= pointRect.left &&
        playerRect.left <= pointRect.right
      ) {
        // Player has collected the point
        point.classList.remove("point");
        score += 10;
        scoreElement.textContent = score;
      }
    }
  });
}

let invulnerable = false;
let lives = 3;
const livesList = document.querySelector(".lives ul");

const enemies = document.querySelectorAll(".enemy");

// Update lives display and check for game over
function updateLives() {
  if (livesList.children.length > 0) {
    livesList.removeChild(livesList.lastElementChild); // Remove one life
  }
}

// Handle player collision with enemies
function checkEnemyCollision() {
  if (!invulnerable) {
    const playerRect = player.getBoundingClientRect();

    enemies.forEach((enemy) => {
      const enemyRect = enemy.getBoundingClientRect();

      // Check if the player is colliding with an enemy
      if (
        playerRect.bottom > enemyRect.top &&
        playerRect.top < enemyRect.bottom &&
        playerRect.right > enemyRect.left &&
        playerRect.left < enemyRect.right
      ) {
        // Collision detected
        lives--;
        updateLives();
        invulnerable = true; // Make player invulnerable for a short period
        player.classList.add("hit");
        isMoving = false;
        enemyHitSound.play();
        playingSound.pause();
        ghostSound.pause();

        setTimeout(() => {
          invulnerable = false; // Restore vulnerability after the cooldown
          player.classList.remove("hit");
          isMoving = true;
          playingSound.play();
          ghostSound.play();
        }, 3000);
        if (lives == 0) {
          player.classList.remove("hit");
          player.classList.add("dead");
          deathSound.play();

          setTimeout(() => {
            playingSound.pause();
            ghostSound.pause();

            // Prompt the player for their name
            const playerName = prompt(
              "Game Over! Your score was " +
                score +
                ". Enter your name or leave blank to play anonymously."
            );

            // Save score to the leaderboard
            saveScoreToLeaderboard(playerName || "Anonymous", score);

            location.reload();
          }, 3000);
        }
      }
    });
  }
}

function saveScoreToLeaderboard(playerName, score) {
  // Get existing leaderboard from local storage
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Add new score to the leaderboard
  leaderboard.push({ name: playerName, score: score });

  // Sort the leaderboard by score in descending order
  leaderboard.sort((a, b) => b.score - a.score);

  // Keep only the top 5 scores
  leaderboard = leaderboard.slice(0, 10);

  // Save the updated leaderboard to local storage
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Update the leaderboard display
  updateLeaderboardDisplay();
}
function updateLeaderboardDisplay() {
  const leaderboardElement = document.querySelector(".leaderboard ol");
  leaderboardElement.innerHTML = ""; // Clear current leaderboard

  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}...${entry.score}`;
    leaderboardElement.appendChild(listItem);
  });
}
function clearLeaderboard() {
  // Remove leaderboard data from local storage
  localStorage.removeItem("leaderboard");

  // Update the leaderboard display to show an empty list
  updateLeaderboardDisplay();
}

function createClearLeaderboardButton() {
  // Create a new button element
  const clearButton = document.createElement("button");

  // Set the text content of the button
  clearButton.textContent = "Clear Leaderboard";
  // Set button styles (optional)
  clearButton.style.padding = "10px 20px";
  clearButton.style.marginTop = "50px";
  clearButton.style.backgroundColor = "red";
  clearButton.style.color = "white";
  clearButton.style.border = "none";
  clearButton.style.borderRadius = "10px";
  clearButton.style.cursor = "pointer";

  // Add an event listener to the button to trigger the clearLeaderboard function when clicked
  clearButton.addEventListener("click", clearLeaderboard);

  // Append the button to the leaderboard section or a specific location in your HTML
  const leaderboardSection = document.querySelector(".leaderboard");
  leaderboardSection.appendChild(clearButton);
}

let isMoving = true;
function updatePlayerPosition() {
  if (isMoving) {
    if (upPressed) {
      playerTop--;
      player.style.top = playerTop + "px";
      playerMouth.classList = "up";

      if (checkCollision()) {
        playerTop = playerTop + 2;
        player.style.top = playerTop + "px";
      }
      checkPointCollection();
      checkEnemyCollision();
    } else if (downPressed) {
      playerTop++;
      player.style.top = playerTop + "px";
      playerMouth.classList = "down";
      if (checkCollision()) {
        playerTop = playerTop - 2;
        player.style.top = playerTop + "px";
      }
      checkPointCollection();
      checkEnemyCollision();
    } else if (leftPressed) {
      playerLeft--;
      player.style.left = playerLeft + "px";
      playerMouth.classList = "left";
      if (checkCollision()) {
        playerLeft = playerLeft + 2;
        player.style.left = playerLeft + "px";
      }
      checkPointCollection();
      checkEnemyCollision();
    } else if (rightPressed) {
      playerLeft++;
      player.style.left = playerLeft + "px";
      playerMouth.classList = "right";
      if (checkCollision()) {
        playerLeft = playerLeft - 2;
        player.style.left = playerLeft + "px";
      }
    }
    checkPointCollection();
    checkEnemyCollision();
  }
}
let gameInterval; // Define the interval variable globally

function createControlButtons() {
  const controlsDiv = document.createElement("div");
  controlsDiv.classList.add("game-controls");

  // Mute Button
  const muteBtn = document.createElement("button");
  muteBtn.id = "muteBtn";
  muteBtn.textContent = "Mute";
  muteBtn.style.padding = "10px 20px";
  muteBtn.style.backgroundColor = "black";
  muteBtn.style.color = "white";
  muteBtn.style.border = "none";
  muteBtn.style.borderRadius = "10px";
  muteBtn.style.cursor = "pointer";
  muteBtn.style.marginRight = "20px";

  // Pause Button
  const pauseBtn = document.createElement("button");
  pauseBtn.id = "pauseBtn";
  pauseBtn.textContent = "Pause";
  pauseBtn.style.padding = "10px 20px";
  pauseBtn.style.backgroundColor = "black";
  pauseBtn.style.color = "white";
  pauseBtn.style.border = "none";
  pauseBtn.style.borderRadius = "10px";
  pauseBtn.style.cursor = "pointer";
  pauseBtn.disabled = true;

  // Append buttons to the control div
  controlsDiv.appendChild(muteBtn);
  controlsDiv.appendChild(pauseBtn);

  // Add the controls div to the body or main container
  document.body.appendChild(controlsDiv);

  // Mute button functionality
  let isMuted = false;
  muteBtn.addEventListener("click", function () {
    isMuted = !isMuted;
    if (isMuted) {
      playingSound.muted = true;
      ghostSound.muted = true;
      enemyHitSound.muted = true;
      deathSound.muted = true;
      introSound.muted = true;
      muteBtn.textContent = "Unmute";
    } else {
      playingSound.muted = false;
      ghostSound.muted = false;
      enemyHitSound.muted = false;
      deathSound.muted = false;
      introSound.muted = false;
      muteBtn.textContent = "Mute";
    }
  });

  // Pause button functionality
  let isPaused = false;
  pauseBtn.addEventListener("click", function () {
    if (isPaused) {
      // Resume the game
      gameInterval = setInterval(updatePlayerPosition, 2);
      countdownInterval = setInterval(startCountdown, 1000);

      playingSound.play();
      ghostSound.play();
      pauseBtn.textContent = "Pause";
    } else {
      // Pause the game
      clearInterval(gameInterval);
      clearInterval(countdownInterval);

      playingSound.pause();
      ghostSound.pause();
      pauseBtn.textContent = "Resume";
    }
    isPaused = !isPaused; // Toggle pause state
  });
}
let countdownTime = 60; // 1 minutes in seconds
let countdownInterval; // To store the interval ID

function startCountdown() {
  countdownInterval = setInterval(() => {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;

    // Display time in MM:SS format
    document.querySelector("#time").textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (countdownTime > 0) {
      countdownTime--;
    } else {
      clearInterval(countdownInterval); // Stop countdown
      clearInterval(gameInterval); // Stop the game loop
      gameOver("Time is up!"); // Trigger game over
    }
  }, 1000);
}
function createTimer() {
  const timerDiv = document.createElement("div");
  timerDiv.classList.add("timer");

  const timerText = document.createElement("p");
  timerText.innerHTML = 'Time left: <br><br><span id="time">01:00</span>';
  timerDiv.appendChild(timerText);

  document.body.appendChild(timerDiv);

  // Add CSS styles dynamically
  timerDiv.style.fontSize = "10px";
  timerDiv.style.position = "fixed";
  timerDiv.style.top = "150px";
  timerDiv.style.right = "65px";
  timerDiv.style.color = "white";
}

function gameOver(message) {
  // Stop the game and show game over message
  clearInterval(gameInterval); // Stop the game loop
  alert(`${message} Your score was ${score}.`);

  // Prompt the player for their name
  const playerName = prompt(
    "Game Over! Your score was " +
      score +
      ". Enter your name or leave blank to play anonymously."
  );

  // Save score to the leaderboard
  saveScoreToLeaderboard(playerName || "Anonymous", score);
  location.reload(); // Reload the game
}

// Add the timer to the page on load
window.onload = () => {
  createTimer(); // Create the timer display
  updateLeaderboardDisplay(); // Load leaderboard
  createClearLeaderboardButton(); // Add clear leaderboard button
  createControlButtons(); // Create mute and pause buttons
};

// hides start button on click
const startDiv = document.querySelector(".start");

function startButton() {
  startDiv.style.display = "none"; // Hide start button
  console.log("Game started");

  // Play the intro sound
  introSound.play();

  // Enable controls and start the game after intro sound ends
  introSound.addEventListener("ended", () => {
    console.log("Intro sound finished");
    // Start the countdown
    startCountdown(); // Begin the 2-minute countdown timer

    // Enable pause buttons
    document.querySelector("#pauseBtn").disabled = false;

    // Play the game background sound and ghost sound
    playingSound.play();
    ghostSound.play();

    // Start the game logic
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    gameInterval = setInterval(updatePlayerPosition, 2); // Start the game interval
  });
}

startDiv.addEventListener("click", startButton);
