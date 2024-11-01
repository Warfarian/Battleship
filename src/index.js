import('./styles.css');

// Ship deployment section
const rotateButton = document.querySelector('#rotate');
const optionContainer = document.querySelector('.option-container');
let angle = 0;

function flip() {
    const optionShips = Array.from(optionContainer.children);
    angle = angle === 0 ? 90 : 0; // Toggle angle
    optionShips.forEach((optionShip) => optionShip.style.transform = `rotate(${angle}deg)`);
}
rotateButton.addEventListener('click', flip);

// ____________ Creating the ships ____________

class Ship {
    constructor(name, length, hits, currentlySunk) {
        this.name = name;
        this.length = length;
        this.hits = hits;
        this.currentlySunk = currentlySunk;
    }
    hit() {
        this.hits += 1;
        return this.hits;
    }
    isSunk() {
        if (this.hits === this.length) {
            this.currentlySunk = true;
            return this.currentlySunk;
        }
        return this.currentlySunk;
    }
}

const width = 10;
const gameboardContainer = document.querySelector('#gameBoards-container');

// ____________ GameBoard class creation ____________

class GameBoard {
    constructor() {
        this.ships = [];
        this.missedAttacks = [];
    }
    createBoards(color, player) {
        const gameboard = document.createElement('div');
        gameboard.classList.add('gameboard');
        gameboard.style.backgroundColor = color;
        gameboard.id = player;
        gameboardContainer.append(gameboard);

        for (let i = 0; i < width * width; i++) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.classList.add(player); // Add player as a class
            block.id = i;
            gameboard.append(block);
        }
    }

    placeShip(userType, ship, startId) {
        let info = document.querySelector('#info');
        info.innerHTML = '';
        const allBoardBlocks = document.querySelectorAll(`#${userType} div`);
        let validStartIndex = Number(startId);
        let isHorizontal = userType === 'user' ? angle === 0 : Math.random() < 0.5;

        // Check if the ship fits
        if (isHorizontal) {
            if (validStartIndex % width > width - ship.length) {
                info.innerHTML = ' Ship does not fit horizontally';
                return false;
            }
        } else {
            if (validStartIndex + (ship.length - 1) * width >= width * width) {
                info.innerHTML = ' Ship does not fit vertically';
                return false;
            }
        }

        // Prepare ship blocks
        let shipBlocks = [];
        for (let i = 0; i < ship.length; i++) {
            let blockIndex = isHorizontal 
                ? validStartIndex + i 
                : validStartIndex + i * width;
            shipBlocks.push(allBoardBlocks[blockIndex]);
        }

        // Check if blocks are already taken
        if (shipBlocks.some(block => block.classList.contains('taken'))) {
            console.log('Some blocks are already taken');
            return false;
        }

        // Mark blocks as taken
        shipBlocks.forEach((shipBlock) => {
            shipBlock.classList.add('taken');
            shipBlock.classList.add(ship.name);
            // Only add visible ship styling for user's ships
            if (userType === 'user') {
                shipBlock.classList.add('ship-visible');
            }
        });

        if (userType === 'computer') {
            this.ships.push(ship);
        }
        
        info.innerHTML = '';
        info.innerHTML = (` ${ship.name} placed successfully`);
        return true;
    }

    // ____________ Computer ship placement____________

    computerPlaceShips(gameBoard) {
        const shipsCopy = [...ships]; // Create a copy to avoid modifying original array
        
        // Shuffle ships to randomize placement order
        for (let i = shipsCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shipsCopy[i], shipsCopy[j]] = [shipsCopy[j], shipsCopy[i]];
        }
    
        // Attempt to place each ship
        for (const ship of shipsCopy) {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100; // Prevent infinite loop
    
            while (!placed && attempts < maxAttempts) {
                const isHorizontal = Math.random() < 0.5;
                const startId = Math.floor(Math.random() * (width * width));
                placed = gameBoard.placeShip('computer', ship, startId);
                attempts++;
                info.innerHTML = '';
            }
    
            if (!placed) {
                console.error(`Could not place ${ship.name} after ${maxAttempts} attempts`);
            }
        }
    }
}   

// ____________ Creating the ships ____________

const destroyer = new Ship('destroyer', 2, 0, false);
const submarine = new Ship('submarine', 3, 0, false);
const cruiser = new Ship('cruiser', 3, 0, false);
const battleship = new Ship('battleship', 4, 0, false);
const carrier = new Ship('carrier', 5, 0, false);
const ships = [destroyer, submarine, cruiser, battleship, carrier];


// Function call to create the boards
const user = new GameBoard();
const computer = new GameBoard();
user.createBoards('pink', 'user');
computer.createBoards('lightblue', 'computer');

// Drag and Drop variables
let draggedShip;
let draggedShipId;
let notDropped = true;

// Set up draggable ships
const optionShips = Array.from(optionContainer.children);
optionShips.forEach(optionShip => {
    optionShip.setAttribute('draggable', true);
    optionShip.addEventListener('dragstart', dragStart);
});

// Drag Start Function
function dragStart(e) {
    draggedShip = e.target;
    draggedShipId = draggedShip.id;
    notDropped = false;
    console.log('Drag started:', draggedShip, 'ID:', draggedShipId);
}

// Drag Over Function
function dragOver(e) {
    e.preventDefault();
}

// Drop Ship Function
function dropShip(e) {
    e.preventDefault();
    const startId = e.target.id;
    console.log('Dropped on block ID:', startId);

    // Find the ship based on the dragged ship's ID
    const ship = ships[draggedShipId];
    console.log('Ship to place:', ship);

    if (ship) {
        const success = user.placeShip('user', ship, startId);
        
        if (success) {
            draggedShip.remove(); // Remove from option container
            notDropped = true;
        }
    }
}

// Add event listeners to player blocks
document.addEventListener('DOMContentLoaded', () => {
    const allPlayerBlocks = document.querySelectorAll('#user .block');
    allPlayerBlocks.forEach((playerBlock) => {
        playerBlock.addEventListener('dragover', dragOver);
        playerBlock.addEventListener('drop', dropShip);
    });
});

// Hit stuff 

let startBtn = document.querySelector('#start');
startBtn.addEventListener('click',startGame);
let turnInfo = document.querySelector('#turn-display');

let gameOver = false;
let playerTurn;

let playerHits = [];
let computerHits = [];
let gameStarted = false;
const playerSunkShips = [];
const computerSunkShips = []; 

function startGame() {
    if (optionContainer.children.length != 0) {
        info.textContent = 'Please place all your pieces first';
        return;
    }
    
    gameStarted = true;
    gameOver = false;
    playerTurn = true; // Player goes first
    
    // Clear any previous game state
    playerHits = [];
    computerHits = [];
    playerSunkShips.length = 0;
    computerSunkShips.length = 0;
    
    // Update UI to show game has started
    startBtn.textContent = 'Game In Progress';
    startBtn.disabled = true;
    turnInfo.textContent = "Your Go!";
    info.textContent = "Game started! Take your shot!";
    
    const allBoardBlocks = document.querySelectorAll('#computer div');
    allBoardBlocks.forEach(block => block.addEventListener('click', attackHandler));
}

function attackHandler(e) {
    if (!gameStarted || !playerTurn || gameOver) {
        return;
    }

    if (e.target.classList.contains('boom') || e.target.classList.contains('empty')) {
        info.textContent = "You already fired at this spot!";
        return;
    }

    if (e.target.classList.contains('taken')) {
        e.target.classList.add('boom');
        info.textContent = "That's a hit! Take another shot!";
        let classes = Array.from(e.target.classList);
        classes = classes.filter(className => 
            className !== 'block' &&
            className !== 'boom' &&
            className !== 'taken' &&
            className !== 'computer'
        );
        playerHits.push(...classes);
        checkScore('player', playerHits, playerSunkShips);
        // Don't switch turns on a hit
        return;
    } else {
        e.target.classList.add("empty");
        info.textContent = "That's a miss!";
        user.missedAttacks.push(e.target.id);
        // Switch turns only on a miss
        playerTurn = false;
        turnInfo.textContent = "Computer's turn";
        
        // Remove click handlers during computer's turn
        const allBoardBlocks = document.querySelectorAll('#computer div');
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)));
        
        setTimeout(computerGo, 1000);
    }
}

function computerGo() {
    if (!gameStarted || gameOver) {
        return;
    }

    turnInfo.textContent = "Computer's Go!";
    info.textContent = "Computer is thinking";

    setTimeout(() => {
        const allBoardBlocks = document.querySelectorAll('#user div');
        let randomGo;
        let targetBlock;
        
        do {
            randomGo = Math.floor(Math.random() * allBoardBlocks.length);
            targetBlock = allBoardBlocks[randomGo];
        } while (
            targetBlock.classList.contains('boom') || 
            targetBlock.classList.contains('empty')
        );

        if (targetBlock.classList.contains('taken')) {
            targetBlock.classList.add('boom');
            info.textContent = "The computer hit your ship! Computer gets another turn!";
            
            let classes = Array.from(targetBlock.classList);
            classes = classes.filter(className => 
                className !== 'block' && 
                className !== 'boom' && 
                className !== 'taken' && 
                className !== 'user'
            );
            computerHits.push(...classes);
            checkScore('computer', computerHits, computerSunkShips);
            // Computer gets another turn on hit
            setTimeout(computerGo, 1000);
            return;
        } else {
            targetBlock.classList.add('empty');
            info.textContent = 'Computer missed!';
            // Switch turns only on a miss
            setTimeout(() => {
                if (!gameOver) {
                    playerTurn = true;
                    turnInfo.textContent = "Your Go!";
                    info.textContent = "Please take your go";
                    const allBoardBlocks = document.querySelectorAll('#computer div');
                    allBoardBlocks.forEach(block => block.addEventListener('click', attackHandler));
                }
            }, 1000);
        }
    }, 1000);
}
function checkScore(user, userHits, userSunkShips) {
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength &&
            !userSunkShips.includes(shipName)
        ) {
            userSunkShips.push(shipName);
            const playerLabel = user === 'computer' ? 'Computer' : 'You';
            info.textContent = `${playerLabel} sunk the ${shipName}!`;
            
            // Check for game over
            if (userSunkShips.length === 5) {
                gameOver = true;
                gameStarted = false;
                info.textContent = `Game Over! ${playerLabel} Win!`;
                turnInfo.textContent = "Game Over!";
                startBtn.textContent = 'Start New Game';
                startBtn.disabled = false;
            }
        }
    }

    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleship', 4);
    checkShip('carrier', 5);

    console.log(`${user} Hits:`, userHits);
    console.log(`${user} Sunk Ships:`, userSunkShips);
}
// Computer ship placement

let computerPlace = new GameBoard();
computerPlace.computerPlaceShips(computer);
