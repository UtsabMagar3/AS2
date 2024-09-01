// Global variables for game state and controls
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

let timer; // For the countdown timer
let score = 0; // Player's score
let lives = 3; // Player's lives
let level = 1; // Initialize level
let invulnerable = false; // Player invulnerability after getting hit
let isMoving = true; // Controls whether the player can move
let playerTop = 0; // Player's top position in pixels
let playerLeft = 0; // Player's left position in pixels
let moveInterval; // Interval for movement
let countdownInterval; // Interval for countdown timer
let countdownTime = 60; // Countdown timer for each level (in seconds)

// Difficulty settings per level
let maxEnemies = 2; // Starts with 3 enemies
let enemySpeed = 10; // Initial speed of enemy movement

// Sounds
const introSound = new Audio("audios/gameIntro.mp3");
const pointSound = new Audio("audios/playing.wav");
const ghostSound = new Audio("audios/ghost.mp3");
const enemyHitSound = new Audio("audios/enemyHit.mp3");
const deathSound = new Audio("audios/death.wav");

// Set volume levels for sounds
pointSound.volume = 0.1;
ghostSound.volume = 0.1;
enemyHitSound.volume = 0.1;
deathSound.volume = 0.1;

const main = document.querySelector("main"); // Main container for the maze
//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 4, 1, 0, 0, 0, 4, 0, 1],
  [1, 0, 4, 0, 4, 4, 4, 4, 4, 1],
  [1, 0, 4, 4, 0, 0, 4, 4, 4, 1],
  [1, 0, 4, 1, 0, 0, 4, 4, 4, 1],
  [1, 0, 4, 0, 4, 4, 0, 1, 1, 1],
  [1, 0, 4, 1, 0, 4, 4, 4, 0, 1],
  [1, 4, 0, 0, 4, 0, 4, 4, 0, 1],
  [1, 4, 4, 4, 0, 0, 0, 4, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Randomized the maze layout each time the webpage is refreshed
function randomizedMaze() {
  let row = Math.floor(Math.random() * maze.length);
  let column = Math.floor(Math.random() * maze[row].length);
  // Ensures only points (0) are replaced with walls (1)
  if (maze[row][column] == 0) {
    maze[row][column] = 1;
  } else {
    randomizedMaze();
  }
}
// Randomly replace points with walls
for (let i = 0; i < 3; i++) {
  randomizedMaze();
}

// Randomized the enemy placement each time the webpage is refreshed
function randomizedEnemy() {
  let row = Math.floor(Math.random() * maze.length);
  let column = Math.floor(Math.random() * maze[row].length);
  // Ensures only points (0) are replaced with enemies (3)
  if (maze[row][column] == 0) {
    maze[row][column] = 3;
  } else {
    randomizedEnemy();
  }
}
// Place 3 enemies randomly
for (let i = 0; i < 1; i++) {
  randomizedEnemy();
}

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
// Create level display element
const levelElement = document.createElement("div");
levelElement.classList.add("level");
levelElement.innerHTML = `Level: <span id="level">${level}</span>`;
// Function to create and display level display
function createLevelDisplay() {
  // Create the level display element
  const levelDiv = document.createElement("div");
  levelDiv.classList.add("level-container");
  levelDiv.appendChild(levelElement);

  document.body.appendChild(levelDiv);

  // Add CSS styles
  levelDiv.style.fontSize = "20px";
  levelDiv.style.height = "20px";
  levelDiv.style.marginTop = "5px";
  levelDiv.style.color = "white";
}
// Function to update level display after each level
function updateLevelDisplay() {
  document.querySelector("#level").textContent = level;
}

// Function to increase difficulty per level
function increaseDifficulty() {
  // Add more enemies every level
  maxEnemies += 1;

  // Increase enemy speed slightly per level
  enemySpeed += 1; // Faster speed
}
// Function to generate new maze layout
function generateNewMaze() {
  // Clear the current maze layout
  main.innerHTML = "";

  // Regenerate the maze layout
  maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 4, 1, 0, 0, 0, 4, 0, 1],
    [1, 0, 4, 0, 4, 4, 4, 4, 4, 1],
    [1, 0, 4, 4, 0, 0, 4, 4, 4, 1],
    [1, 0, 4, 1, 0, 0, 4, 4, 4, 1],
    [1, 0, 4, 0, 4, 4, 0, 1, 1, 1],
    [1, 0, 4, 1, 0, 4, 4, 4, 0, 1],
    [1, 4, 0, 0, 4, 0, 4, 4, 0, 1],
    [1, 4, 4, 4, 0, 0, 0, 4, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  // Add walls as difficulty increases
  for (let i = 0; i < level * 3; i++) {
    randomizedMaze(); // Add more walls
  }
  for (let i = 0; i < maxEnemies; i++) {
    randomizedEnemy(); // Add more enemies
  }

  // Repopulate the maze in the HTML
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
  // Increment and update level
  level++;
  updateLevelDisplay();
  increaseDifficulty();

  const player = document.querySelector("#player");
  const playerMouth = player.querySelector(".mouth");
  let playerTop = 0;
  let playerLeft = 0;

  // Adjust player size to fit the maze properly
  function playerSize() {
    player.style.height = "75%";
    player.style.width = "75%";
  }
  playerSize();
  // Get all the wall elements
  const walls = document.querySelectorAll(".wall");

  // Function to check for collisions with walls
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

  // Get all the point elements
  const scoreElement = document.querySelector(".score p");
  const pointElements = document.querySelectorAll(".point"); // Select all point elements

  // Function to check for point collection
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
          pointSound.play();

          if (timer) {
            clearTimeout(timer);
          }

          timer = setTimeout(() => {
            pointSound.pause();
          }, 250);
        }
      }
    });
  }

  // Get all the enemy elements
  const enemies = document.querySelectorAll(".enemy");

  // Function to check for collision between enemies and player
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
          player.classList.add("hit");
          invulnerable = true; // Make player invulnerable for a short period
          isMoving = false;
          enemyHitSound.play();
          ghostSound.pause();

          setTimeout(() => {
            invulnerable = false; // Restore vulnerability after the cooldown
            player.classList.remove("hit");
            isMoving = true;
            ghostSound.play();
          }, 2000);

          if (lives == 0) {
            player.classList.remove("hit");
            player.classList.add("dead");
            deathSound.play();

            setTimeout(() => {
              ghostSound.pause();
              ghostSound.loop = false;

              // Prompt the player for their name
              const playerName = prompt(
                "Game Over! Your score was " +
                  score +
                  ". Enter your name or leave blank to play anonymously."
              );

              // Save score to the leaderboard
              saveScoreToLeaderboard(playerName || "Anonymous", score);
              showRestartButton();
            }, 1500);
          }
        }
      });
    }
  }
  // Function to update player position
  function updatePlayerPosition() {
    if (isMoving) {
      if (upPressed) {
        playerTop--;
        player.style.top = playerTop + "px";
        playerMouth.classList = "up";
        if (checkCollision()) {
          playerTop += 2;
          player.style.top = playerTop + "px";
        }
        checkPointCollection();
        checkEnemyCollision();
      } else if (downPressed) {
        playerTop++;
        player.style.top = playerTop + "px";
        playerMouth.classList = "down";
        if (checkCollision()) {
          playerTop -= 2;
          player.style.top = playerTop + "px";
        }
        checkPointCollection();
        checkEnemyCollision();
      } else if (leftPressed) {
        playerLeft--;
        player.style.left = playerLeft + "px";
        playerMouth.classList = "left";
        if (checkCollision()) {
          playerLeft += 2;
          player.style.left = playerLeft + "px";
        }
        checkPointCollection();
        checkEnemyCollision();
      } else if (rightPressed) {
        playerLeft++;
        player.style.left = playerLeft + "px";
        playerMouth.classList = "right";
        if (checkCollision()) {
          playerLeft -= 2;
          player.style.left = playerLeft + "px";
        }
      }

      checkPointCollection();
      checkEnemyCollision();
    }
    if (allPointsCollected()) {
      resetTimer();
      generateNewMaze();
    }
  }
  setInterval(updatePlayerPosition, 5);
}

// Function to check if all points have been collected
function allPointsCollected() {
  // Check if there are any points left in the maze
  return !Array.from(document.querySelectorAll(".point")).length;
}
// Function to reset the countdown timer
function resetTimer() {
  clearInterval(countdownInterval);
  countdownTime = 60; // Reset to 1 minute
  startCountdown();
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

// Function to create and display restart button
function showRestartButton() {
  clearInterval(countdownInterval);
  clearInterval(gameInterval);
  clearInterval(enemyInterval);
  ghostSound.muted = true;
  enemyHitSound.muted = true;

  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart";
  restartButton.classList.add("restart-button");

  // Add CSS styles dynamically (or add them to your CSS file)
  restartButton.style.position = "absolute";
  restartButton.style.top = "50%";
  restartButton.style.left = "50%";
  restartButton.style.transform = "translate(-50%, -50%)";
  restartButton.style.padding = "10px 20px";
  restartButton.style.fontSize = "20px";
  restartButton.style.backgroundColor = "red";
  restartButton.style.color = "white";
  restartButton.style.border = "none";
  restartButton.style.borderRadius = "5px";
  restartButton.style.cursor = "pointer";

  document.body.appendChild(restartButton);

  // Add event listener to restart the game
  restartButton.addEventListener("click", () => {
    location.reload(); // Reload the page to restart the game
  });
}

// Get player and player mouth elements
const player = document.querySelector("#player");
const playerMouth = player.querySelector(".mouth");

// Get all the wall elements
const walls = document.querySelectorAll(".wall");

// Function to check for collisions of player with walls
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

// Get all the point elements
const scoreElement = document.querySelector(".score p");
const pointElements = document.querySelectorAll(".point"); // Select all point elements

// Function to check for point collection, remove points from maze and add score
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
        pointSound.play();

        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
          pointSound.pause();
        }, 250);
      }
    }
  });
}

// Get all the enemy elements
const livesList = document.querySelector(".lives ul");
const enemies = document.querySelectorAll(".enemy");

// Function to update lives display
function updateLives() {
  if (livesList.children.length > 0) {
    livesList.removeChild(livesList.lastElementChild); // Remove one life
  }
}

//Function to handle player collision with enemies
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
        invulnerable = true;
        player.classList.add("hit");
        isMoving = false;
        enemyHitSound.play();
        ghostSound.pause();

        setTimeout(() => {
          invulnerable = false; // Restore vulnerability after the cooldown
          player.classList.remove("hit");
          isMoving = true;
          ghostSound.play();
        }, 2000);
        if (lives == 0) {
          player.classList.remove("hit");
          player.classList.add("dead");
          deathSound.play();

          setTimeout(() => {
            ghostSound.pause();
            ghostSound.loop = false;

            // Prompt the player for their name
            const playerName = prompt(
              "Game Over! Your score was " +
                score +
                ". Enter your name or leave blank to play anonymously."
            );

            // Save score to the leaderboard
            saveScoreToLeaderboard(playerName || "Anonymous", score);

            showRestartButton();
          }, 1500);
        }
      }
    });
  }
}
// Function to generate random number
function randomNumber() {
  return Math.floor(Math.random() * 4) + 1;
}

let direction = randomNumber();

// Function to check collision of enemies with walls
function detectEnemyWallCollision(enemy) {
  const enemyBoundary = enemy.getBoundingClientRect();
  const walls = document.getElementsByClassName("wall");

  for (let wall of walls) {
    const WallBoundary = wall.getBoundingClientRect();

    if (
      enemyBoundary.top < WallBoundary.bottom &&
      enemyBoundary.bottom > WallBoundary.top &&
      enemyBoundary.left < WallBoundary.right &&
      enemyBoundary.right > WallBoundary.left
    ) {
      // Collision detected with wall
      return true;
    }
  }

  // No collision with walls
  return false;
}

// Function to move the enemies

function moveEnemies() {
  const enemies = document.getElementsByClassName("enemy");

  for (let enemy of enemies) {
    let enemyTop = parseInt(enemy.style.top) || 0;
    let enemyLeft = parseInt(enemy.style.left) || 0;
    let direction = enemy.direction || randomNumber();

    if (direction === 1) {
      // MOVE DOWN
      enemy.style.top = enemyTop + enemySpeed + "px";
      if (detectEnemyWallCollision(enemy)) {
        enemy.style.top = enemyTop + "px";
        direction = randomNumber();
      }
    }

    if (direction === 2) {
      // MOVE UP
      enemy.style.top = enemyTop - enemySpeed + "px";
      if (detectEnemyWallCollision(enemy)) {
        enemy.style.top = enemyTop + "px";
        direction = randomNumber();
      }
    }

    if (direction === 3) {
      // MOVE LEFT
      enemy.style.left = enemyLeft - enemySpeed + "px";
      if (detectEnemyWallCollision(enemy)) {
        enemy.style.left = enemyLeft + "px";
        direction = randomNumber();
      }
    }

    if (direction === 4) {
      // MOVE RIGHT
      enemy.style.left = enemyLeft + enemySpeed + "px";
      if (detectEnemyWallCollision(enemy)) {
        enemy.style.left = enemyLeft + "px";
        direction = randomNumber();
      }
    }

    enemy.direction = direction;
  }
}
// Function to save score to leaderboard
function saveScoreToLeaderboard(playerName, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Add new score to the leaderboard
  leaderboard.push({ name: playerName, score: score });

  // Sort the leaderboard by score in descending order
  leaderboard.sort((a, b) => b.score - a.score);

  // Keep only the top 10 scores
  leaderboard = leaderboard.slice(0, 10);

  // Save the updated leaderboard to local storage
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Update the leaderboard display
  updateLeaderboardDisplay();
}

// Function to update leaderboard display
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

// Function to clear leaderboard
function clearLeaderboard() {
  // Remove leaderboard data from local storage
  localStorage.removeItem("leaderboard");
  updateLeaderboardDisplay();
}

// Function to create and display clear leaderboard button
function createClearLeaderboardButton() {
  // Create a new button element
  const clearButton = document.createElement("button");

  // Set the text content of the button
  clearButton.textContent = "Clear Leaderboard";

  // Set button styles
  clearButton.style.padding = "10px 20px";
  clearButton.style.marginTop = "30px";
  clearButton.style.backgroundColor = "red";
  clearButton.style.color = "white";
  clearButton.style.border = "none";
  clearButton.style.borderRadius = "10px";
  clearButton.style.cursor = "pointer";
  clearButton.addEventListener("click", clearLeaderboard);

  // Append the button to the leaderboard section or a specific location in your HTML
  const leaderboardSection = document.querySelector(".leaderboard");
  leaderboardSection.appendChild(clearButton);
}

// Function to update player position
function updatePlayerPosition() {
  if (isMoving) {
    if (upPressed) {
      playerTop--;
      player.style.top = playerTop + "px";
      playerMouth.classList = "up";
      if (checkCollision()) {
        playerTop += 2;
        player.style.top = playerTop + "px";
      }
      checkPointCollection();
      checkEnemyCollision();
    } else if (downPressed) {
      playerTop++;
      player.style.top = playerTop + "px";
      playerMouth.classList = "down";
      if (checkCollision()) {
        playerTop -= 2;
        player.style.top = playerTop + "px";
      }
      checkPointCollection();
      checkEnemyCollision();
    } else if (leftPressed) {
      playerLeft--;
      player.style.left = playerLeft + "px";
      playerMouth.classList = "left";
      if (checkCollision()) {
        playerLeft += 2;
        player.style.left = playerLeft + "px";
      }
      checkPointCollection();
      checkEnemyCollision();
    } else if (rightPressed) {
      playerLeft++;
      player.style.left = playerLeft + "px";
      playerMouth.classList = "right";
      if (checkCollision()) {
        playerLeft -= 2;
        player.style.left = playerLeft + "px";
      }
    }

    checkPointCollection();
    checkEnemyCollision();

    if (allPointsCollected()) {
      resetTimer();
      generateNewMaze();
    }
  }
}

let gameInterval;

// Function to create and display mute and pause buttons
function createControlButtons() {
  const controlsDiv = document.createElement("div");
  controlsDiv.classList.add("game-controls");

  // Mute Button
  const muteBtn = document.createElement("button");
  muteBtn.id = "muteBtn";
  muteBtn.textContent = "Mute";
  muteBtn.style.marginTop = "20px";
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
  pauseBtn.style.marginTop = "20px";
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
      pointSound.muted = true;
      ghostSound.muted = true;
      enemyHitSound.muted = true;
      deathSound.muted = true;
      introSound.muted = true;
      muteBtn.textContent = "Unmute";
    } else {
      pointSound.muted = false;
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
      gameInterval = setInterval(updatePlayerPosition, 5);
      enemyInterval = setInterval(moveEnemies, 100);
      startCountdown(); // Resume the countdown
      isMoving = true;
      ghostSound.play();
      pauseBtn.textContent = "Pause";
    } else {
      // Pause the game
      clearInterval(gameInterval);
      isMoving = false;
      clearInterval(countdownInterval);
      clearInterval(enemyInterval);
      ghostSound.pause();
      pauseBtn.textContent = "Resume";
    }
    isPaused = !isPaused;
  });
}
// Function to start countdown timer
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
      ghostSound.pause();
      gameOver("Time is up!"); // Trigger game over
      showRestartButton();
    }
  }, 1000);
}
// Function to create and display timer
function createTimer() {
  const timerDiv = document.createElement("div");
  timerDiv.classList.add("timer");

  const timerText = document.createElement("p");
  timerText.innerHTML = 'Time left: <br><br><span id="time">01:00</span>';
  timerDiv.appendChild(timerText);

  document.body.appendChild(timerDiv);

  // Add CSS styles dynamically
  timerDiv.style.fontSize = "10px";
  timerDiv.style.height = "20px";
  timerDiv.style.position = "absolute";
  timerDiv.style.textDecoration = "underline";
  timerDiv.style.top = "200px";
  timerDiv.style.right = "65px";
  timerDiv.style.color = "white";
}
// Function to display game over message
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
}
// Function to adjust player size to fit the maze properly
function playerSize() {
  const player = document.querySelector("#player");
  player.style.height = "75%";
  player.style.width = "75%";
}
window.onload = () => {
  createTimer(); // Create the timer display
  updateLeaderboardDisplay(); // Load leaderboard
  createClearLeaderboardButton(); // Add clear leaderboard button
  createControlButtons(); // Create mute and pause buttons
  createLevelDisplay(); // Create level display
  playerSize();
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
    startCountdown();

    // Enable pause buttons
    document.querySelector("#pauseBtn").disabled = false;

    // Play the game background sound and ghost sound
    ghostSound.play();
    ghostSound.loop = true;

    // Start the game logic
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    gameInterval = setInterval(updatePlayerPosition, 5); // Start the game interval
    enemyInterval = setInterval(moveEnemies, 100); // Start the game interval
  });
}

startDiv.addEventListener("click", startButton);

// Screen arrow button movement

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
