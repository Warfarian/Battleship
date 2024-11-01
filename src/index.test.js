import { Ship } from ".";

it('Ship sinking',()=>{
    let test = new Ship('wackoShip',4,4,true);
    expect(test.isSunk()).toBe(true);
})

it('hits and isSunk function working', () => {
    let test = new Ship('wackoShip',4,0,false);
    test.hit();
    test.hit();
    test.hit();
    test.hit();
    expect(test.isSunk()).toBe(true);
})