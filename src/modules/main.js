class Ship{
    constructor(length,hit,currentlySunk,shipCoordinates){
        this.length = length,
        this.hit = hit || 0,
        this.currentlySunk = currentlySunk,
        this.shipCoordinates = null;
    }

    shipLength(){
        return this.length;
    }

    hits(){
        while (this.hit < this.length || this.hit === 0){
            this.hit += 1;
            return this.hit;    
        }
        }

    isSunk(){
        if (this.length === this.hit){
            return true;            
        }
        else{
            return false;
        }        
        
    }
}


class Gameboard {
    constructor(missedAttacks, actualAttacks,allShipsSunk){
        this.missedAttacks = [],
        this.actualAttacks = [],
        this.allShipsSunk = false;
    }

    receiveAttack(attackCoordinates,coords){
        if (this.arraysEqual(attackCoordinates,coords)){
            if (!this.actualAttacks.some(temp => this.arraysEqual(temp,coords))){
                this.actualAttacks.push(attackCoordinates);
                this.missedAttacks.push(attackCoordinates);
                    return this.actualAttacks;
                }
            }   
        else{
            if (!this.missedAttacks.some(coords => this.arraysEqual(coords,attackCoordinates))){
                this.missedAttacks.push(attackCoordinates);
                 return this.missedAttacks;
            }
        }
        return this.actualAttacks,this.missedAttacks;
    }

    arraysEqual(arr1,arr2){
        return Array.isArray(arr1) && Array.isArray(arr2) && arr1.length === arr2.length && arr1.every((value,index) => value === arr2[index]);
    }

    assignCoordinates(coords){
        let newShip = new Ship();
        coords = newShip.shipCoordinates;
        return coords;
    }


    winner(){
        let sunkShips = 0;
        let winner = null;
        if (sunkShips === 5){
            return winner;
        }

        else{
            return;
        }
    }


}

class Players{
    player = new Gameboard();
    cpu = new Gameboard();
}

export {Ship,Gameboard,Players};