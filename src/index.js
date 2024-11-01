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

// Dragging the ships
let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach(optionShip => {
    optionShip.setAttribute('draggable', true);
    optionShip.addEventListener('dragstart', dragStart);
});

const allPlayerBlocks = document.querySelectorAll('#user div');
allPlayerBlocks.forEach((playerBlock) => {
    playerBlock.addEventListener('dragover', dragOver);
    playerBlock.addEventListener('drop', dropShip);
});

function dragStart(e) {
    notDropped = false;
    draggedShip = e.target;
}

function dragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
}

function dropShip(e) {
    e.preventDefault(); // Prevent default behavior (e.g., opening a link)
    
    const startId = e.target.id; // Use the id of the drop target
    const ship = ships.find(s => s.name === draggedShip.id); // Find the corresponding ship object

    if (ship) {
        const success = user.placeShip('player', ship, startId);
        if (success && notDropped) {
            draggedShip.remove(); // Remove the ship from the option container
        }
    }
}



// Creating the ships
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

// GameBoard class creation 
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
            block.id = i;
            gameboard.append(block);
        }
    }

    placeShip(userType, ship, startId) {
        const allBoardBlocks = document.querySelectorAll(`#${userType} div`);
        let validStartIndex;
        let placedSuccessfully = false;

        if (userType === "player") {
            // User placed ship
            validStartIndex = Number(startId);
            let isHorizontal = angle === 0; // Check user's orientation

            // Check if the ship fits based on orientation
            if (isHorizontal) {
                if (validStartIndex % width <= width - ship.length) {
                    // Valid horizontal start
                } else {
                    return; // Not enough space horizontally
                }
            } else {
                if (validStartIndex + ship.length * width < width * width) {
                    // Valid vertical start
                } else {
                    return; // Not enough space vertically
                }
            }

            // Prepare ship blocks
            let shipBlocks = [];
            for (let i = 0; i < ship.length; i++) {
                shipBlocks.push(isHorizontal ? allBoardBlocks[validStartIndex + i] : allBoardBlocks[validStartIndex + i * width]);
            }

            // Check if any of the blocks are already taken
            if (shipBlocks.some(block => block.classList.contains('taken'))) {
                return; // If any block is taken, do nothing
            }

            // Mark the blocks as taken
            shipBlocks.forEach((shipBlock) => {
                shipBlock.classList.add('taken');
                shipBlock.classList.add(ship.name);
            });

            placedSuccessfully = true; // Successfully placed the ship
        } else {
            // Randomly place ship for the computer
            do {
                let randomStartIndex = Math.floor(Math.random() * width * width);
                let isHorizontal = Math.random() < 0.5; // Random orientation

                // Check if the ship can fit
                if (isHorizontal) {
                    if (randomStartIndex % width <= width - ship.length) {
                        validStartIndex = randomStartIndex; // Valid horizontal start
                    } else {
                        continue; // Not enough space
                    }
                } else {
                    if (randomStartIndex + ship.length * width < width * width) {
                        validStartIndex = randomStartIndex; // Valid vertical start
                    } else {
                        continue; // Not enough space
                    }
                }

                // Prepare ship blocks
                let shipBlocks = [];
                for (let i = 0; i < ship.length; i++) {
                    shipBlocks.push(isHorizontal ? allBoardBlocks[validStartIndex + i] : allBoardBlocks[validStartIndex + i * width]);
                }

                // Check if any of the blocks are already taken
                if (shipBlocks.some(block => block.classList.contains('taken'))) {
                    continue; // If any block is taken, continue to find a new position
                }

                // Mark the blocks as taken
                shipBlocks.forEach((shipBlock) => {
                    shipBlock.classList.add('taken');
                    shipBlock.classList.add(ship.name);
                });

                placedSuccessfully = true; 
                this.ships.push(ship); //add tp board
                // Successfully placed the ship
            } while (!placedSuccessfully);
            return this.placedSuccessfully
        }
    }
}

// Function call to create the boards
const user = new GameBoard();
const computer = new GameBoard();

user.createBoards('pink', 'user');
computer.createBoards('lightblue', 'computer');

// Create the ships
const destroyer = new Ship('destroyer', 2, 0, false);
const submarine = new Ship('submarine', 3, 0, false);
const cruiser = new Ship('cruiser', 3, 0, false);
const battleship = new Ship('battleship', 4, 0, false);
const carrier = new Ship('carrier', 5, 0, false);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

// Place ships for the computer (you may want to do this at game start)
ships.forEach((ship) => computer.placeShip('computer', ship));
