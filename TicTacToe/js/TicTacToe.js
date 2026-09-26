// TicTacToe.js

// Variable to keep track of whose turn it is
let activePlayer = 'X';

// Array to store moves
let selectedSquares = [];

// Prevents additional moves after a game has ended
let gameOver = false;


// Function to place X or O in a square
function placeXOrO(squareNumber) {

    // Don't allow moves after the game is over
    if (gameOver) {
        return false;
    }

    // Make sure squareNumber is a string
    squareNumber = String(squareNumber);

    // Check if the square has already been selected
    if (selectedSquares.some(element => element.startsWith(squareNumber))) {
        return false;
    }

    // Get the HTML element that was clicked
    const select = document.getElementById(squareNumber);

    // Place the appropriate image
    if (activePlayer === 'X') {
        select.style.backgroundImage = 'url("images/x.png")';
    } else {
        select.style.backgroundImage = 'url("images/o.png")';
    }

    // Add square number and player to the array
    selectedSquares.push(squareNumber + activePlayer.toLowerCase());


    // Play placement sound
    audio('./media/place.mp3');

    // Check for a win or tie
    const gameEnded = checkWinConditions();

    // Don't change players if the game has ended
    if (gameEnded) {
        return true;
    }

    // Change active player
    activePlayer = activePlayer === 'X' ? 'O' : 'X';

    // If it is the computer's turn
    if (activePlayer === 'O') {
        disableClick();

        setTimeout(function () {
            computersTurn();
        }, 1000);
    }

    return true;
}


// Computer's turn
function computersTurn() {

    if (gameOver) {
        return;
    }

    // Find all available squares
    const availableSquares = [];

    for (let i = 0; i < 9; i++) {
        const square = String(i);

        if (!selectedSquares.some(element => element.startsWith(square))) {
            availableSquares.push(square);
        }
    }

    // No available moves
    if (availableSquares.length === 0) {
        return;
    }

    // Pick a random available square
    const randomIndex = Math.floor(Math.random() * availableSquares.length);
    const pickASquare = availableSquares[randomIndex];

    // Place the computer's move
    placeXOrO(pickASquare);
}


// Check all winning combinations
function checkWinConditions() {

    const winningConditions = [

    ['0X', '1X', '2X'],
    ['3X', '4X', '5X'],
    ['6X', '7X', '8X'],
    ['0X', '3X', '6X'],
    ['1X', '4X', '7X'],
    ['2X', '5X', '8X'],
    ['0X', '4X', '8X'],
    ['2X', '4X', '6X'],

    ['0O', '1O', '2O'],
    ['3O', '4O', '5O'],
    ['6O', '7O', '8O'],
    ['0O', '3O', '6O'],
    ['1O', '4O', '7O'],
    ['2O', '5O', '8O'],
    ['0O', '4O', '8O'],
    ['2O', '4O', '6O']

    ];

    const lineCoordinates = [
        [50, 100, 558, 100],
        [50, 304, 558, 304],
        [50, 508, 558, 508],
        [100, 50, 100, 558],
        [304, 50, 304, 558],
        [508, 50, 508, 558],
        [100, 100, 520, 520],
        [508, 100, 100, 510]
    ];

    for (let i = 0; i < winningConditions.length; i++) {

        if (arrayIncludes(
            winningConditions[i][0],
            winningConditions[i][1],
            winningConditions[i][2]
        )) {

            const lineIndex = i % 8;
            const coordinates = lineCoordinates[lineIndex];

            gameOver = true;

            drawWinLine(
                coordinates[0],
                coordinates[1],
                coordinates[2],
                coordinates[3]
            );

            return true;
        }
    }

    // Check for a tie
    if (selectedSquares.length >= 9) {

        gameOver = true;

        audio('./media/tie.mp3');

        setTimeout(function () {
            resetGame();
        }, 500);

        return true;
    }

    return false;
}


// Check whether three squares exist in selectedSquares
function arrayIncludes(squareA, squareB, squareC) {

    return (
        selectedSquares.includes(squareA) &&
        selectedSquares.includes(squareB) &&
        selectedSquares.includes(squareC)
    );
}


// Reset the game
function resetGame() {

    // Clear all squares
    for (let i = 0; i < 9; i++) {

        const square = document.getElementById(String(i));

        square.style.backgroundImage = '';
    }

    // Clear the winning line
    const canvas = document.getElementById('win-lines');
    const c = canvas.getContext('2d');

    c.clearRect(0, 0, 608, 608);

    // Reset game variables
    selectedSquares = [];
    activePlayer = 'X';
    gameOver = false;
}


// Play audio
function audio(audioURL) {

    const sound = new Audio(audioURL);

    sound.play().catch(function (error) {
        console.log('Audio could not be played:', error);
    });
}


// Draw animated winning line
function drawWinLine(coordX1, coordY1, coordX2, coordY2) {

    const canvas = document.getElementById('win-lines');
    const c = canvas.getContext('2d');

    let x = coordX1;
    let y = coordY1;

    const dx = coordX2 - coordX1;
    const dy = coordY2 - coordY1;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const stepX = dx / distance * 10;
    const stepY = dy / distance * 10;

    function animateLineDrawing() {

        c.clearRect(0, 0, canvas.width, canvas.height);

        c.beginPath();
        c.moveTo(coordX1, coordY1);
        c.lineTo(x, y);

        c.lineWidth = 10;
        c.strokeStyle = 'rgba(70, 255, 33, 0.8)';
        c.stroke();

        // Continue drawing
        if (
            Math.abs(x - coordX2) > 10 ||
            Math.abs(y - coordY2) > 10
        ) {

            x += stepX;
            y += stepY;

            requestAnimationFrame(animateLineDrawing);

        } else {

            // Draw the complete line
            c.clearRect(0, 0, canvas.width, canvas.height);

            c.beginPath();
            c.moveTo(coordX1, coordY1);
            c.lineTo(coordX2, coordY2);

            c.lineWidth = 10;
            c.strokeStyle = 'rgba(70, 255, 33, 0.8)';
            c.stroke();

            audio('./media/winGame.mp3');

            // Reset after displaying the winning line
            setTimeout(function () {
                resetGame();
            }, 1000);
        }
    }

    animateLineDrawing();
}


// Disable clicks during computer's turn
function disableClick() {

    const body = document.getElementById('body');

    body.style.pointerEvents = 'none';

    setTimeout(function () {
        if (!gameOver) {
            body.style.pointerEvents = 'auto';
        }
    }, 1000);
}
