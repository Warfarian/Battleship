import ('./styles.css')

class Ship{
    constructor(length,hit,currentlySunk,shipCoordinates){
        this.length = length,
        this.hit = hit,
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
    constructor(attacks, actualAttacks){
        this.attacks = [];
        this.actualAttacks = [];
    }

    receiveAttack(attackCoordinates,coords){
        if (this.arraysEqual(attackCoordinates,coords)){
            if (!this.actualAttacks.some(temp => this.arraysEqual(temp,coords))){
                this.actualAttacks.push(attackCoordinates);
                this.attacks.push(attackCoordinates);
                    return this.actualAttacks;
                }
            }   
        else{
            if (!this.attacks.some(coords => this.arraysEqual(coords,attackCoordinates))){
                this.attacks.push(attackCoordinates);
                 return this.attacks;
            }
        }
        return this.actualAttacks,this.attacks;
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
        
    }


}

class Players{
    player = {};
    cpu = {};
}

export {Ship,Gameboard,Players};