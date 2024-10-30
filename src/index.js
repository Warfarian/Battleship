import ('./styles.css')

class Ship{
    constructor(length,hit,currentlySunk){
        this.length = length,
        this.hit = hit,
        this.currentlySunk = currentlySunk;
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

    receiveAttack(attackCoordinates,actualCoordinates){
        if (this.arraysEqual(attackCoordinates,actualCoordinates)){
            if (!this.actualAttacks.some(coords => this.arraysEqual(coords,actualCoordinates))){
                this.actualAttacks.push(attackCoordinates);
                this.attacks.push(attackCoordinates);
                    return this.actualAttacks;
                }
            }   
        else{
            if (!this.attacks.some(coords => this.arraysEqual(coords,attackCoordinates))){
                this.attacks.push(attackCoordinates);
                 return attacks;
            }
        }
        return this.actualAttacks;
    }

    arraysEqual(arr1,arr2){
        return Array.isArray(arr1) && Array.isArray(arr2) && arr1.length === arr2.length && arr1.every((value,index) => value === arr2[index]);
    }

    winner(){
        
    }


}

class Players{
    player = {};
    cpu = {};
}

export {Ship,Gameboard,Players};