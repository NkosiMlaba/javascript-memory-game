const gridContainer = document.querySelector(".grid-container");
const scoreElement = document.querySelector(".score");
const leaderboardList = document.querySelector(".leaderboard-list");
const winDialog = document.getElementById("win-dialog");
const timerElement = document.getElementById("timer");
const scorenowElement = document.getElementById("scorenow");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let scorenow = 0;
let playerMoves = 0;
let playerRank = 0;
let leaderboard = [];
let timerInterval;
let timerSeconds = 0;

const initialLeaderboard = [
    { name: "Zoey", moves: 9 },
    { name: "Niko", moves: 11 },
    { name: "Anna", moves: 12 },
    { name: "Erik", moves: 16 },
    { name: "Arthur", moves: 20 },
    { name: "Promise", moves: 24 },
    { name: "Lia", moves: 26 },
    { name: "Rafael", moves: 28 },
    { name: "Mia", moves: 30 },
    { name: "Franco", moves: 32 },
];

/**
 * Initializes the leaderboard with the initial data and resets player's moves and rank.
 */
function initializeLeaderboard() {
    leaderboard = JSON.parse(JSON.stringify(initialLeaderboard));
    playerMoves = 0;
    playerRank = 0;
    updateLeaderboardDisplay();
}

/**
 * Shuffles the elements of an array in place.
 * @param {Array} array - The array to shuffle.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Creates the card elements and appends them to the grid container.
 * @param {Array} cards - The array of card objects.
 */
function createCardElements(cards) {
    gridContainer.innerHTML = "";
    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.name = card.name;
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src="${card.image}" alt="${card.name}" />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", handleCardFlip);
    });
    startTimer();
}

/**
 * Handles the card flip event.
 */
function handleCardFlip() {
    if (lockBoard || this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    updateScore();
    playerMoves += 1;
    lockBoard = true;

    checkForMatch();
    updateLeaderboard();
}

/**
 * Updates the score and displays it.
 */
function updateScore() {
    score++;
    scoreElement.textContent = score;
}

/**
 * Checks if the two flipped cards match.
 */
function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableMatchedCards() : unflipMismatchedCards();
    if (isMatch) {
        scorenow ++;
        scorenowElement.textContent = scorenow;
    }
    
}

/**
 * Disables the matched cards and resets the board.
 */
function disableMatchedCards() {
    firstCard.removeEventListener("click", handleCardFlip);
    secondCard.removeEventListener("click", handleCardFlip);
    resetBoard();
    if (document.querySelectorAll(".card:not(.flipped)").length === 0) {
        stopTimer();
        updateLeaderboard(true);
        showWinDialog();
    }
}

/**
 * Unflips the mismatched cards after a delay.
 */
function unflipMismatchedCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

/**
 * Resets the board variables.
 */
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

/**
 * Updates the leaderboard with the current player's moves and rank.
 * @param {boolean} isWin - Indicates if the game has been won.
 */
function updateLeaderboard(isWin = false) {
    const currentPlayer = { name: "Current Player", moves: playerMoves };
    if (isWin) {
        leaderboard.push(currentPlayer);
    }

    leaderboard.sort((a, b) => a.moves - b.moves);
    leaderboard = leaderboard.slice(0, 10);

    if (!isWin) {
        playerRank = leaderboard.findIndex(player => player.name === "Current Player");
    }

    updateLeaderboardDisplay();
}

/**
 * Displays the leaderboard in the leaderboard list.
 */
function updateLeaderboardDisplay() {
    leaderboardList.innerHTML = "";
    leaderboard.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${player.name} - ${player.moves} moves`;
        if (player.name === "Current Player") {
            if (index < playerRank) {
                li.classList.add("move-up");
            } else if (index > playerRank) {
                li.classList.add("move-down");
            }
            playerRank = index;
        }
        leaderboardList.appendChild(li);
    });

    setTimeout(() => {
        document.querySelectorAll('.move-up, .move-down').forEach(el => {
            el.classList.remove('move-up', 'move-down');
        });
    }, 500);
}

/**
 * Shows the win dialog.
 */
function showWinDialog() {
    winDialog.style.display = "block";
}

/**
 * Closes the win dialog.
 */
function closeWinDialog() {
    winDialog.style.display = "none";
}

/**
 * Starts the timer.
 */
function startTimer() {
    timerSeconds = 0;
    timerElement.textContent = formatTime(timerSeconds);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        timerElement.textContent = formatTime(timerSeconds);
    }, 1000);
}

/**
 * Stops the timer.
 */
function stopTimer() {
    clearInterval(timerInterval);
}

/**
 * Formats the time in minutes and seconds.
 * @param {number} seconds - The time in seconds.
 * @returns {string} - The formatted time.
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

/**
 * Resets the game variables and restarts the game.
 */
function restart() {
    resetBoard();
    shuffleArray(cards);
    score = 0;
    scorenow = 0;
    scoreElement.textContent = score;
    scorenowElement.textContent = scorenow
    playerMoves = 0;
    playerRank = 0;
    createCardElements(cards);
    initializeLeaderboard();
    closeWinDialog();
    startTimer();
}

// Entry point
initializeLeaderboard();
scoreElement.textContent = score;
scorenowElement.textContent = scorenow;
fetch("./data/cards.json")
    .then((response) => response.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleArray(cards);
        createCardElements(cards);
    });