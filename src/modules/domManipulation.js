// grid creation 

function createGrid(gridId, itemCount) {
    const grid = document.getElementById(gridId);
    
    const gridSize = Math.sqrt(itemCount); // Assuming a square grid
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add(`${gridId}-cell`);
            // Convert to a coordinate system (e.g., A1, B2, ...)
            const coords = `${String.fromCharCode(65 + i)}${j + 1}`; // A=65
            gridItem.setAttribute("data-coords", coords);
            gridItem.addEventListener('click', () => getCoords(coords,gridId));
            grid.appendChild(gridItem);
        }
    }
}

function getCoords(coords,gridId) {
    console.log(`Cell clicked: ${coords} in ${gridId}`);
}

export { createGrid, getCoords };
