const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

const scoreElement = document.querySelector(".score");
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
    gridContainer.innerHTML = ""; // Clear existing cards if any
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
    lockBoard = true;

    checkForMatch();
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

function restart() {
    resetBoard();
    shuffleArray(cards);
    score = 0;
    scoreElement.textContent = score;
    createCardElements(cards);
}

document.querySelector(".restart-button").addEventListener("click", restart);
