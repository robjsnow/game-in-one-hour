document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameMusic = document.getElementById('game-music');
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    
    startButton.addEventListener('click', () => {
        // Play the music
        gameMusic.play();

        // Hide the start button and show the game board
        startContainer.style.display = 'none';
        gameContainer.style.display = 'block';

        startGame();
    });

    function startGame() {
        const cardImages = [
            'images/image1.png', 
            'images/image2.png', 
            'images/image3.png', 
            'images/image4.png', 
            'images/image5.png', 
            'images/image6.png', 
            'images/image7.png',
            'images/image8.png'
        ]; // Paths to the front images
        let cardsArray = [...cardImages, ...cardImages]; // Duplicate the array for pairs
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;

        // Shuffle the cards
        cardsArray.sort(() => 0.5 - Math.random());

        // Create the cards and add them to the board
        cardsArray.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back"></div>
                </div>`;
            
            // Set the front image using JavaScript
            const cardFront = card.querySelector('.card-front');
            cardFront.style.backgroundImage = `url(${image})`;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });

        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;

            this.classList.add('flipped');

            if (!firstCard) {
                firstCard = this;
                return;
            }

            secondCard = this;
            checkForMatch();
        }

        function checkForMatch() {
            if (firstCard.querySelector('.card-front').style.backgroundImage === 
                secondCard.querySelector('.card-front').style.backgroundImage) {
                disableCards();
                checkForWin(); // Check if all cards have been matched
            } else {
                unflipCards();
            }
        }

        function disableCards() {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            resetBoard();
        }

        function unflipCards() {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 1500);
        }

        function resetBoard() {
            [firstCard, secondCard] = [null, null];
            lockBoard = false;
        }

        function checkForWin() {
            const allCards = document.querySelectorAll('.card');
            const allFlipped = [...allCards].every(card => card.classList.contains('flipped'));

            if (allFlipped) {
                setTimeout(() => {
                    alert('Congratulations! You have matched all the cards!');
                    resetGame();
                }, 500);
            }
        }

        function resetGame() {
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.classList.remove('flipped');
                card.addEventListener('click', flipCard); // Re-enable clicking
            });

            // Reshuffle the cards
            cardsArray.sort(() => 0.5 - Math.random());

            // Reassign images to the cards
            allCards.forEach((card, index) => {
                const cardFront = card.querySelector('.card-front');
                cardFront.style.backgroundImage = `url(${cardsArray[index]})`;
            });

            resetBoard();
        }
    }
});
