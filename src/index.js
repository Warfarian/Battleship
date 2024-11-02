import { Ship, GameBoard, createShips } from './game.js';
import { DOMController } from './domManipulation.js';
import './styles.css'

export class GameController {
    constructor() {
        this.domController = new DOMController();
        this.playerBoard = new GameBoard();
        this.computerBoard = new GameBoard();
        this.ships = createShips();
        this.gameStarted = false;
        this.playerTurn = true;
        this.gameOver = false;
        
        this.init();
    }

    init() {
        this.domController.createBoard('#FFDC7F', 'user');
        this.domController.createBoard('#78B7D0', 'computer');
        this.domController.setupDragAndDrop(this.ships, this.playerBoard);
        this.domController.setupRotateButton();
        this.setupComputerBoard();
        this.setupGameControls();
        this.updateGameStatus('Place your ships to begin!');
    }

    updateGameStatus(infoMessage, turnMessage = '') {
        if (this.domController.info) {
            this.domController.info.textContent = infoMessage;
        }
        if (this.domController.turnDisplay && turnMessage) {
            this.domController.turnDisplay.textContent = turnMessage;
        }
    }

    setupComputerBoard() {
        const ships = createShips();
        Object.values(ships).forEach(ship => {
            let placed = false;
            while (!placed) {
                const startId = Math.floor(Math.random() * 100);
                const isHorizontal = Math.random() < 0.5;
                placed = this.computerBoard.placeShip(ship, startId, isHorizontal);
            }
        });
    }

    setupGameControls() {
        this.domController.startBtn.addEventListener('click', () => this.startGame());
        document.querySelectorAll('#computer .block').forEach(block => {
            block.addEventListener('click', (e) => this.handlePlayerAttack(e));
        });
    }

    startGame() {
        if (this.domController.optionContainer.children.length > 0) {
            this.updateGameStatus('Please place all your ships first!', 'Game not started');
            return;
        }

        if (this.gameOver) {
            // Reset game state for new game
            window.location.reload();
            return;
        }

        this.gameStarted = true;
        this.playerTurn = true;
        this.gameOver = false;
        this.domController.startBtn.textContent = 'Game In Progress';
        this.domController.startBtn.disabled = true;
        this.updateGameStatus('Game Started! Click on the opponent\'s board to attack.', 'Your turn!');
    }

    handlePlayerAttack(e) {
        if (!this.gameStarted || !this.playerTurn || this.gameOver) {
            if (!this.gameStarted) {
                this.updateGameStatus('Please start the game first!');
            }
            return;
        }

        const position = Number(e.target.id);
        
        // Check if position was already attacked
        if (this.computerBoard.missedAttacks.includes(position) || 
            e.target.classList.contains('boom')) {
            this.updateGameStatus('You\'ve already attacked this position!', 'Your turn!');
            return;
        }

        const result = this.computerBoard.receiveAttack(position);
        this.domController.updateBoardDisplay('computer', position, result);

        if (result.hit) {
            this.updateGameStatus('Direct hit! Take another shot!', 'Your turn!');
            // Check if ship was sunk
            if (result.ship && result.ship.isSunk()) {
                this.updateGameStatus(`You sunk the enemy's ${result.ship.name}!`, 'Your turn!');
            }
        } else {
            this.updateGameStatus('Miss! Computer\'s turn...', 'Computer\'s turn');
            this.playerTurn = false;
            this.computerTurn();
        }

        this.checkGameOver();
    }

    computerTurn() {
        setTimeout(() => {
            let position;
            do {
                position = Math.floor(Math.random() * 100);
            } while (this.playerBoard.missedAttacks.includes(position) || 
                    document.querySelector(`#user div[id="${position}"]`).classList.contains('boom'));

            const result = this.playerBoard.receiveAttack(position);
            this.domController.updateBoardDisplay('user', position, result);

            if (result.hit) {
                this.updateGameStatus('Computer landed a hit!', 'Computer\'s turn');
                // Check if ship was sunk
                if (result.ship && result.ship.isSunk()) {
                    this.updateGameStatus(`Computer sunk your ${result.ship.name}!`, 'Computer\'s turn');
                }
                this.computerTurn();
            } else {
                this.updateGameStatus('Computer missed! Your turn!', 'Your turn!');
                this.playerTurn = true;
            }

            this.checkGameOver();
        }, 1000);
    }

    checkGameOver() {
        if (this.playerBoard.allShipsSunk() || this.computerBoard.allShipsSunk()) {
            this.gameOver = true;
            this.gameStarted = false;
            const winner = this.playerBoard.allShipsSunk() ? 'Computer' : 'Player';
            
            let endMessage = winner === 'Player' ? 
                'Congratulations! You won the battle!' : 
                'Game Over - The computer has won this time!';
                
            this.updateGameStatus(endMessage, 'Game Over!');
            this.domController.startBtn.textContent = 'Start New Game';
            this.domController.startBtn.disabled = false;
        }
    }
}

// Initialize game
new GameController();