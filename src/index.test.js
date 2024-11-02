import { Ship, GameBoard, createShips } from './game.js';

describe('Ship Class', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship('destroyer', 2);
    });

    test('should create ship with correct properties', () => {
        expect(ship.name).toBe('destroyer');
        expect(ship.length).toBe(2);
        expect(ship.hits).toBe(0);
        expect(ship.currentlySunk).toBe(false);
    });

    test('should increment hits when hit()', () => {
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test('should not be sunk before all positions are hit', () => {
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test('should be sunk when all positions are hit', () => {
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
        expect(ship.currentlySunk).toBe(true);
    });
});

describe('GameBoard Class', () => {
    let gameBoard;
    let ship;

    beforeEach(() => {
        gameBoard = new GameBoard();
        ship = new Ship('destroyer', 2);
    });

    describe('Ship Placement', () => {
        test('should place ship horizontally when valid', () => {
            const result = gameBoard.placeShip(ship, 0, true);
            expect(result).toBe(true);
            expect(gameBoard.ships.length).toBe(1);
            expect(gameBoard.ships[0].positions).toEqual([0, 1]);
        });

        test('should place ship vertically when valid', () => {
            const result = gameBoard.placeShip(ship, 0, false);
            expect(result).toBe(true);
            expect(gameBoard.ships[0].positions).toEqual([0, 10]);
        });

        test('should not place ship horizontally if it would go off board', () => {
            const result = gameBoard.placeShip(ship, 9, true);
            expect(result).toBe(false);
            expect(gameBoard.ships.length).toBe(0);
        });

        test('should not place ship vertically if it would go off board', () => {
            const result = gameBoard.placeShip(ship, 95, false);
            expect(result).toBe(false);
            expect(gameBoard.ships.length).toBe(0);
        });

        test('should not place ship if position is already taken', () => {
            gameBoard.placeShip(ship, 0, true);
            const newShip = new Ship('submarine', 3);
            const result = gameBoard.placeShip(newShip, 0, true);
            expect(result).toBe(false);
            expect(gameBoard.ships.length).toBe(1);
        });
    });

    describe('Attack Handling', () => {
        beforeEach(() => {
            gameBoard.placeShip(ship, 0, true);
        });

        test('should record hit when attack hits ship', () => {
            const result = gameBoard.receiveAttack(0);
            expect(result.hit).toBe(true);
            expect(result.ship).toBe(ship);
            expect(ship.hits).toBe(1);
        });

        test('should record miss when attack misses ship', () => {
            const result = gameBoard.receiveAttack(5);
            expect(result.hit).toBe(false);
            expect(result.ship).toBe(null);
            expect(gameBoard.missedAttacks).toContain(5);
        });

        test('should detect when all ships are sunk', () => {
            gameBoard.receiveAttack(0);
            gameBoard.receiveAttack(1);
            expect(gameBoard.allShipsSunk()).toBe(true);
        });

        test('should not consider all ships sunk if some still float', () => {
            gameBoard.receiveAttack(0);
            expect(gameBoard.allShipsSunk()).toBe(false);
        });
    });
});

describe('Ship Factory', () => {
    test('should create all ships with correct properties', () => {
        const ships = createShips();
        
        expect(ships.destroyer.length).toBe(2);
        expect(ships.submarine.length).toBe(3);
        expect(ships.cruiser.length).toBe(3);
        expect(ships.battleship.length).toBe(4);
        expect(ships.carrier.length).toBe(5);
        
        Object.values(ships).forEach(ship => {
            expect(ship instanceof Ship).toBe(true);
            expect(ship.hits).toBe(0);
            expect(ship.currentlySunk).toBe(false);
        });
    });
});

describe('Game Edge Cases', () => {
    let gameBoard;

    beforeEach(() => {
        gameBoard = new GameBoard();
    });

    test('should handle multiple attacks on same position', () => {
        const ship = new Ship('destroyer', 2);
        gameBoard.placeShip(ship, 0, true);
        
        const firstHit = gameBoard.receiveAttack(0);
        const secondHit = gameBoard.receiveAttack(0);
        
        expect(firstHit.hit).toBe(true);
        expect(secondHit.hit).toBe(true);
        expect(ship.hits).toBe(2);
    });

    test('should handle overlapping ship placement attempts', () => {
        const ship1 = new Ship('destroyer', 2);
        const ship2 = new Ship('submarine', 3);
        
        gameBoard.placeShip(ship1, 0, true); // places at [0,1]
        const result = gameBoard.placeShip(ship2, 1, false); // tries to place at [1,11,21]
        
        expect(result).toBe(false);
        expect(gameBoard.ships.length).toBe(1);
    });
});