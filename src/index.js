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
        });

        if (userType === 'computer') {
            this.ships.push(ship);
        }
        
        
        info.innerHTML = '';
        info.innerHTML = (` ${ship.name} placed successfully`);
        return true;
    }

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
                // Randomly choose horizontal or vertical orientation
                const isHorizontal = Math.random() < 0.5;
                
                // Generate a random start position
                const startId = Math.floor(Math.random() * (width * width));
    
                // Try to place the ship
                placed = gameBoard.placeShip('computer', ship, startId);
                attempts++;
                info.innerHTML = '';
            }
    
            if (!placed) {
                console.error(`Could not place ${ship.name} after ${maxAttempts} attempts`);
            }
        }
    }


    attackLogic(userAttack,coords){

    }
}


// ____________ Computer ship placement____________


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

// Computer ship placement

let computerPlace = new GameBoard();
computerPlace.computerPlaceShips(computer);
