import ('./styles.css')

class ship{
    constructor(length,hit,isSunk){
        this.length = length(),
        this.hit = hit(),
        this.isSunk = isSunk();
    }

    length(){
        let counter = 0;
        
    }

    hit(){
        
    }

    isSunk(){

    }
}


class gameBoard {
    player(){

    }

    cpu(){

    }
}


class players{
    player = {};
    cpu = {};
}

export {ship,gameBoard,players};