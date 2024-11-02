export class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.hits = 0;
        this.currentlySunk = false;
    }

    hit() {
        this.hits += 1;
        return this.hits;
    }

    isSunk() {
        if (this.hits === this.length) {
            this.currentlySunk = true;
            return true;
        }
        return false;
    }
}

export class GameBoard {
    constructor() {
        this.ships = [];
        this.missedAttacks = [];
        this.width = 10;
    }

    placeShip(ship, startId, isHorizontal) {
        const validStartIndex = Number(startId);

        // Check if ship fits
        if (isHorizontal) {
            if (validStartIndex % this.width > this.width - ship.length) {
                return false;
            }
        } else {    
            if (validStartIndex + (ship.length - 1) * this.width >= this.width * this.width) {
                return false;
            }
        }

        // Calculate ship positions
        const shipPositions = [];
        for (let i = 0; i < ship.length; i++) {
            const position = isHorizontal 
                ? validStartIndex + i 
                : validStartIndex + i * this.width;
            shipPositions.push(position);
        }

        // Check if positions are already taken
        if (this.isPositionsTaken(shipPositions)) {
            return false;
        }

        // Add ship to board
        this.ships.push({
            ship,
            positions: shipPositions,
            isHorizontal
        });

        return true;
    }

    isPositionsTaken(positions) {
        return this.ships.some(shipData => 
            shipData.positions.some(pos => 
                positions.includes(pos)
            )
        );
    }

    receiveAttack(position) {
        const hitShip = this.ships.find(shipData => 
            shipData.positions.includes(position)
        );

        if (hitShip) {
            hitShip.ship.hit();
            return {
                hit: true,
                ship: hitShip.ship
            };
        }

        this.missedAttacks.push(position);
        return {
            hit: false,
            ship: null
        };
    }

    allShipsSunk() {
        return this.ships.every(shipData => shipData.ship.isSunk());
    }
}

export const createShips = () => ({
    destroyer: new Ship('destroyer', 2),
    submarine: new Ship('submarine', 3),
    cruiser: new Ship('cruiser', 3),
    battleship: new Ship('battleship', 4),
    carrier: new Ship('carrier', 5)
});