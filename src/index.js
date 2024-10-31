import { Ship, Gameboard, Players } from "./modules/main.js";
import('./styles.css');
import { createGrid } from "./modules/domManipulation.js";



const newPlayer = new Players();
newPlayer.Gameboard = new Gameboard();




let createShips = (length,hit,currentlySunk,shipCoordinates) => {
    let temp = new Ship(length,hit,currentlySunk,shipCoordinates);
}

// click events
const playerCell = document.querySelectorAll('.playerGrid-cell');
playerCell.forEach((cell)=>{
    cell.addEventListener('click',getCoords);
})

const cpuCell = document.querySelectorAll('.cpuGrid-cell');
cpuCell.forEach((cell)=>{
    cell.addEventListener('click',getCoords);
})

// grid create function call
createGrid('playerGrid', 100);
createGrid('cpuGrid', 100);


export {newPlayer}