const gridContainer = document.querySelector(".grid-container");
const scoreElement = document.querySelector(".score");
const leaderboardList = document.querySelector(".leaderboard-list");
const winDialog = document.getElementById("win-dialog");
const timerElement = document.getElementById("timer");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let playerMoves = 0;
let playerRank = 0;
let leaderboard = [];
let timerInterval;
let timerSeconds = 0;

// Predefined leaderboard with 10 best players and their number of moves
const initialLeaderboard = [
    { name: "Player 1", moves: 15 },
    { name: "Player 2", moves: 16 },
    { name: "Player 3", moves: 18 },
    { name: "Player 4", moves: 20 },
    { name: "Player 5", moves: 22 },
    { name: "Player 6", moves: 24 },
    { name: "Player 7", moves: 26 },
    { name: "Player 8", moves: 28 },
    { name: "Player 9", moves: 30 },
    { name: "Player 10", moves: 32 },
];

// Initialize the leaderboard
function initializeLeaderboard() {
    leaderboard = JSON.parse(JSON.stringify(initialLeaderboard));
    playerMoves = 0;
    playerRank = 0;
    updateLeaderboardDisplay();
}

initializeLeaderboard();

scoreElement.textContent = score;

fetch("./data/cards.json")
    .then((response) => response.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleArray(cards);
        createCardElements(cards);
    });

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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
    startTimer(); // Start the timer when the cards are created
}

function handleCardFlip() {
    if (lockBoard || this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    updateScore();
    playerMoves += 2; // Each pair of cards flipped counts as 2 moves
    lockBoard = true;

    checkForMatch();
    updateLeaderboard();
}

function updateScore() {
    score++;
    scoreElement.textContent = score;
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableMatchedCards() : unflipMismatchedCards();
}

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

function unflipMismatchedCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateLeaderboard(isWin = false) {
    const currentPlayer = { name: "Current Player", moves: playerMoves };
    if (isWin) {
        leaderboard.push(currentPlayer);
    }

    leaderboard.sort((a, b) => a.moves - b.moves);
    leaderboard = leaderboard.slice(0, 10); // Keep only top 10

    if (!isWin) {
        playerRank = leaderboard.findIndex(player => player.name === "Current Player");
    }

    updateLeaderboardDisplay();
}

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

    // Remove animation classes after they are applied
    setTimeout(() => {
        document.querySelectorAll('.move-up, .move-down').forEach(el => {
            el.classList.remove('move-up', 'move-down');
        });
    }, 500);
}

function showWinDialog() {
    winDialog.style.display = "block";
}

function closeWinDialog() {
    winDialog.style.display = "none";
}

function startTimer() {
    timerSeconds = 0;
    timerElement.textContent = formatTime(timerSeconds);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds++;
        timerElement.textContent = formatTime(timerSeconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function restart() {
    resetBoard();
    shuffleArray(cards);
    score = 0;
    scoreElement.textContent = score;
    playerMoves = 0;
    playerRank = 0;
    createCardElements(cards);
    initializeLeaderboard();
    closeWinDialog();
    startTimer(); // Start the timer when the game is restarted
}

// document.querySelector(".restart-button").addEventListener("click", restart);
