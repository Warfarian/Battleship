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
        console.log(`Creating gameboard with id: ${player}`);
        gameboardContainer.append(gameboard);

        for (let i = 0; i < width * width; i++) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.classList.add(player); // Add player as a class
            block.id = i;
            gameboard.append(block);
            console.log(`Block created with ID: ${i}`);
        }

        console.log(`Gameboard created for ${player} with ${gameboard.childElementCount} blocks.`);
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
                let isHorizontal = user === 'player' ? angle === 0 : Math.random() < 0.5; // Random orientation

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
                this.ships.push(ship); // Add to board
                // Successfully placed the ship
            } while (!placedSuccessfully);
            return this.placedSuccessfully;
        }
    }
}

// Function call to create the boards
const user = new GameBoard();
const computer = new GameBoard();
user.createBoards('pink', 'user');
computer.createBoards('lightblue', 'computer');

// ____________ Dragging the ships ____________

let draggedShip;
let notDropped = true; // Declare the variable
const optionShips = Array.from(optionContainer.children);

optionShips.forEach(optionShip => {
    optionShip.setAttribute('draggable', true);
    optionShip.addEventListener('dragstart', dragStart);
});

document.addEventListener('DOMContentLoaded', () => {
    const allPlayerBlocks = document.querySelectorAll('#user .block');
    console.log('Player blocks:', allPlayerBlocks.length);
    allPlayerBlocks.forEach((playerBlock) => {
        console.log('Adding event listeners to:', playerBlock.id);
        playerBlock.addEventListener('dragover', dragOver);
        playerBlock.addEventListener('drop', dropShip);
    });
});

function dragStart(e) {
    console.log('Drag started:', e.target);
    notDropped = false;
    draggedShip = e.target;
}

function dragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    console.log('Dragging over:', e.target);
}

function dropShip(e) {
    e.preventDefault(); // Prevent default behavior (e.g., opening a link)
    console.log('Dropped on:', e.target);

    const startId = e.target.id; // Ensure the target has the correct ID
    console.log('StartId:', startId);

    if (!startId) {
        console.log('No valid drop target ID');
        return;
    }

    const ship = ships.find(s => s.name === draggedShip.id); // Find the corresponding ship object
    console.log('Ship:', ship);

    if (ship) {
        const success = user.placeShip('player', ship, startId);
        console.log('Placed ship:', success);
        if (success && notDropped) {
            draggedShip.remove(); // Remove the ship from the option container
        }
    } else {
        console.log('Ship not found or not dropped correctly');
    }
}

// ____________ Creating the ships ____________

const destroyer = new Ship('destroyer', 2, 0, false);
const submarine = new Ship('submarine', 3, 0, false);
const cruiser = new Ship('cruiser', 3, 0, false);
const battleship = new Ship('battleship', 4, 0, false);
const carrier = new Ship('carrier', 5, 0, false);
const ships = [destroyer, submarine, cruiser, battleship, carrier];

// Place ships for the computer (you may want to do this at game start)
ships.forEach((ship) => computer.placeShip('computer', ship));
