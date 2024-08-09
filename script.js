document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameMusic = document.getElementById('game-music');
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const gameBoard = document.getElementById('game-board');
    const loadingScreen = document.getElementById('loading-screen');

    // Ensure only the loading screen is visible initially
    startContainer.style.display = 'none';
    gameContainer.style.display = 'none';

    // Preload the images
    const cardImages = [
        'images/image1.png',
        'images/image2.png',
        'images/image3.png',
        'images/image4.png',
        'images/image5.png',
        'images/image6.png',
        'images/image7.png',
        'images/image8.png'
    ];
    let cardsArray = [...cardImages, ...cardImages];
    let imagesLoaded = 0;

    cardsArray.forEach((image) => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === cardsArray.length) {
                // Intentionally delay the fade-out of the loading screen
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        startContainer.style.display = 'flex';
                    }, 1000); // 1 second fade out
                }, 2000); // 2-second delay after loading is complete for aesthetics
            }
        };
    });

    startButton.addEventListener('click', () => {
        gameMusic.play();
        startContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        startGame();
    });

    function startGame() {
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;

        cardsArray.sort(() => 0.5 - Math.random());

        cardsArray.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front" style="background-image: url(${image});"></div>
                    <div class="card-back"></div>
                </div>`;
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
                checkForWin();
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
              resetGame();
                }, 2200);
            }
        }

        function resetGame() {
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.classList.remove('flipped');
                card.addEventListener('click', flipCard);
            });

            cardsArray.sort(() => 0.5 - Math.random());

            allCards.forEach((card, index) => {
                const cardFront = card.querySelector('.card-front');
                cardFront.style.backgroundImage = `url(${cardsArray[index]})`;
            });

            resetBoard();
        }
    }
});
