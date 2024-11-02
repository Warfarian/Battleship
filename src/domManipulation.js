export class DOMController {
    constructor() {
        this.width = 10;
        this.gameboardContainer = document.querySelector('#gameBoards-container');
        this.info = document.querySelector('#info');
        this.turnDisplay = document.querySelector('#turn-display');
        this.startBtn = document.querySelector('#start');
        this.rotateButton = document.querySelector('#rotate');
        this.optionContainer = document.querySelector('.option-container');
        this.angle = 0;
    }

    createBoard(color, player) {
        const gameboard = document.createElement('div');
        gameboard.classList.add('gameboard');
        gameboard.style.backgroundColor = color;
        gameboard.id = player;
        this.gameboardContainer.append(gameboard);

        for (let i = 0; i < this.width * this.width; i++) {
            const block = document.createElement('div');
            block.classList.add('block', player);
            block.id = i;
            gameboard.append(block);
        }
    }

    updateBoardDisplay(boardId, position, result) {
        const block = document.querySelector(`#${boardId} div[id="${position}"]`);
        if (!block) return;

        if (result.hit) {
            block.classList.add('boom', 'taken', result.ship.name);
        } else {
            block.classList.add('empty');
        }
    }

    setupDragAndDrop(ships, playerBoard) {
        if (!this.optionContainer) {
            console.error('Option container not found');
            return;
        }

        const optionShips = Array.from(this.optionContainer.children);
        optionShips.forEach((ship, index) => {
            ship.setAttribute('draggable', true);
            ship.setAttribute('data-ship-index', index.toString()); // Add index as data attribute
            ship.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('shipIndex', index);
            });
        });

        const playerBlocks = document.querySelectorAll('#user .block');
        playerBlocks.forEach(block => {
            block.addEventListener('dragover', (e) => e.preventDefault());
            block.addEventListener('drop', (e) => this.handleShipDrop(e, ships, playerBoard));
        });
    }

    handleShipDrop(e, ships, playerBoard) {
        e.preventDefault();
        const shipIndex = parseInt(e.dataTransfer.getData('shipIndex'));
        
        // Validate shipIndex
        if (isNaN(shipIndex) || shipIndex < 0 || shipIndex >= Object.values(ships).length) {
            console.error('Invalid ship index');
            return;
        }

        const ship = Object.values(ships)[shipIndex];
        const startId = parseInt(e.target.id);
        const isHorizontal = this.angle === 0;

        // Find the ship element using the data attribute
        const shipElement = this.optionContainer.querySelector(`[data-ship-index="${shipIndex}"]`);
        
        if (!shipElement) {
            console.error('Ship element not found');
            return;
        }

        if (playerBoard.placeShip(ship, startId, isHorizontal)) {
            this.updateShipDisplay(startId, ship, isHorizontal);
            e.target.classList.add('taken');
            shipElement.remove(); // Remove the ship element using the reference
        }
    }

    updateShipDisplay(startId, ship, isHorizontal) {
        const blocks = document.querySelectorAll('#user .block');
        const positions = [];

        for (let i = 0; i < ship.length; i++) {
            const position = isHorizontal 
                ? Number(startId) + i 
                : Number(startId) + i * this.width;
            
            // Validate position is within bounds
            if (position >= 0 && position < blocks.length) {
                positions.push(position);
            }
        }

        // Only update if all positions are valid
        if (positions.length === ship.length) {
            positions.forEach(position => {
                blocks[position].classList.add('taken', 'ship-visible', ship.name);
            });
        }
    }

    setupRotateButton() {
        if (!this.rotateButton) {
            console.error('Rotate button not found');
            return;
        }

        this.rotateButton.addEventListener('click', () => {
            this.angle = this.angle === 0 ? 90 : 0;
            const ships = Array.from(this.optionContainer?.children || []);
            ships.forEach(ship => {
                ship.style.transform = `rotate(${this.angle}deg)`;
            });
        });
    }
}