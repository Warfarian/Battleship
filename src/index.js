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
    gameboard.classList.add('gameboard-container');
    gameboardContainer.append(gameboard);
    gameboard.style.backgroundColor = color;
    gameboard.id = player;
}


createBoards('pink','user');
createBoards('lightblue','computer');