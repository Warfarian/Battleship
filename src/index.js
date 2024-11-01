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

// create boards

const width = 10;
const gameboardContainer = document.querySelector('#gameBoards-container');

function createBoards(color,player){
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

// board creation function call

createBoards('pink','user');
createBoards('lightblue','computer');

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


// gameBoard class creation 

class gameBoard{
    constructor(){

    }
}

// create the ships

const destroyer   = new Ship('destroyer',2,0,false);
const submarine = new Ship('submarine',3,3,false);
const cruiser = new Ship('cruiser',3,0,false);
const battleship = new Ship('battleship',4,0,false);
const carrier = new Ship('carrier',5,0,false);

const shipCollection = [destroyer,submarine,cruiser,battleship,carrier];

// export statements , will modularize later

export {Ship}