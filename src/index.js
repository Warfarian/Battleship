import('./styles.css');

// ship deployment section 

const rotateButton = document.querySelector('#rotate');
const optionContainer = document.querySelector('.option-container');
let angle = 0;


function flip(){
    const optionShips = Array.from(optionContainer.children);
    if (angle === 0){
        angle = 90;
    }
    else{
        angle = 0;
    }
    optionShips.forEach((optionShip)=>optionShip.style.transform = `rotate(${angle}deg)`)
}


rotateButton.addEventListener('click', flip);

//creating the ships

class Ship{
    constructor(name,length,hits,currentlySunk){
        this.name = name;
        this.length = length;
        this.hits = hits;
        this.currentlySunk = currentlySunk;
    }

    hit(){
            this.hits = this.hits + 1;
            return this.hits;
        
    }

    isSunk(){
        if (this.hits === this.length){
            this.currentlySunk = true;
            return this.currentlySunk;
        }
        else{
            return this.currentlySunk;
        }
    }

}


const width = 10;
const gameboardContainer = document.querySelector('#gameBoards-container');

// gameBoard class creation 

class gameBoard{
    constructor(){
        this.ships = [];
        this.missedAttacks = [];
    }

    createBoards(color,player){
    const gameboard = document.createElement('div');
    gameboard.classList.add('gameboard');
    gameboardContainer.append(gameboard);
    gameboard.style.backgroundColor = color;
    gameboard.id = player;

    for (let i =0; i < width * width; i++){
        let block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameboard.append(block);
    }
}

placeShipRandom(ship) {
    const allBoardBlocks = document.querySelectorAll(`#computer div`);
    let validStartIndex;
    let placedSuccessfully = false;

    do {
        // Randomly determine orientation and starting index
        const isHorizontal = Math.random() < 0.5;
        let randomStartIndex = Math.floor(Math.random() * width * width);

        // Determine if the ship fits based on orientation
        if (isHorizontal) {
            // Check if the ship can fit horizontally
            if (randomStartIndex % width <= width - ship.length) {
                validStartIndex = randomStartIndex; // Valid horizontal start
            } else {
                continue; // Not enough space horizontally, continue to next iteration
            }
        } else {
            // Check if the ship can fit vertically
            if (randomStartIndex + ship.length * width < width * width) {
                validStartIndex = randomStartIndex; // Valid vertical start
            } else {
                continue; // Not enough space vertically, continue to next iteration
            }
        }

        // At this point, validStartIndex should be valid
        let shipBlocks = [];
        for (let i = 0; i < ship.length; i++) {
            if (isHorizontal) {
                shipBlocks.push(allBoardBlocks[validStartIndex + i]);
            } else {
                shipBlocks.push(allBoardBlocks[validStartIndex + i * width]);
            }
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

        placedSuccessfully = true; // Successfully placed the ship

    } while (!placedSuccessfully);
}



}

//function call to create the boards


const user = new gameBoard();
const computer = new gameBoard();

user.createBoards('pink','user');
computer.createBoards('lightblue','computer');

// create the ships

const destroyer   = new Ship('destroyer',2,0,false);
const submarine = new Ship('submarine',3,3,false);
const cruiser = new Ship('cruiser',3,0,false);
const battleship = new Ship('battleship',4,0,false);
const carrier = new Ship('carrier',5,0,false);
const shipCollection = [destroyer,submarine,cruiser,battleship,carrier];


//place ships

computer.placeShipRandom(destroyer,user);
computer.placeShipRandom(submarine,user);
computer.placeShipRandom(cruiser,user);
computer.placeShipRandom(battleship,user);
computer.placeShipRandom(carrier,user);



// export statements , will modularize later

export {Ship}