import { Ship, Gameboard, Players } from "./modules/main.js";
import('./styles.css');

function createGrid(gridId, itemCount) {
    const grid = document.getElementById(gridId);
    
    for (let i = 1; i <= itemCount; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('cell');
        grid.appendChild(gridItem);
    }
}

createGrid('playerGrid', 100);
createGrid('cpuGrid', 100);
