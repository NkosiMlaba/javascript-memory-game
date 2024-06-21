document.addEventListener('DOMContentLoaded', () => {
    const cardArray = [
        { name: 'A', img: 'A' },
        { name: 'A', img: 'A' },
        { name: 'B', img: 'B' },
        { name: 'B', img: 'B' },
        { name: 'C', img: 'C' },
        { name: 'C', img: 'C' },
        { name: 'D', img: 'D' },
        { name: 'D', img: 'D' },
        { name: 'E', img: 'E' },
        { name: 'E', img: 'E' },
        { name: 'F', img: 'F' },
        { name: 'F', img: 'F' },
        { name: 'G', img: 'G' },
        { name: 'G', img: 'G' },
        { name: 'H', img: 'H' },
        { name: 'H', img: 'H' }
    ];

    cardArray.sort(() => 0.5 - Math.random());

    const gameBoard = document.getElementById('gameBoard');
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];

    function createBoard() {
        for (let i = 0; i < cardArray.length; i++) {
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('data-id', i);
            card.addEventListener('click', flipCard);
            const front = document.createElement('div');
            front.classList.add('front');
            const back = document.createElement('div');
            back.classList.add('back');
            back.textContent = cardArray[i].img;
            card.appendChild(front);
            card.appendChild(back);
            gameBoard.appendChild(card);
        }
    }

    function flipCard() {
        let selectedCard = this;
        let cardId = selectedCard.getAttribute('data-id');
        if (cardsChosen.length < 2 && !selectedCard.classList.contains('flip')) {
            selectedCard.classList.add('flip');
            cardsChosen.push(cardArray[cardId].name);
            cardsChosenId.push(cardId);

            if (cardsChosen.length == 2) {
                setTimeout(checkForMatch, 1000);
            }
        }
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('.card');
        const optionOneId = cardsChosenId[0];
        const optionTwoId = cardsChosenId[1];

        if (cardsChosen[0] === cardsChosen[1]) {
            cards[optionOneId].classList.add('matched');
            cards[optionTwoId].classList.add('matched');
            cardsWon.push(cardsChosen);
        } else {
            cards[optionOneId].classList.remove('flip');
            cards[optionTwoId].classList.remove('flip');
        }
        
        cardsChosen = [];
        cardsChosenId = [];
        
        if (cardsWon.length === cardArray.length/2) {
            setTimeout(() => alert('Congratulations! You found them all!'), 500);
        }
    }

    createBoard();
});
