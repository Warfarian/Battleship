import { experiments } from "webpack";
import { Ship, Gameboard, Players } from "./src/index.js";

it('Class created', () => {
    expect(Ship).toBe(Ship);
})


it('Game board created', () => {
    expect(Gameboard).toBe(Gameboard);
})


it('Players ready', () => {
    expect(Players).toBe(Players);
})

it('Hits calculated', () => {
    let newShip = new Ship(4,1,true);
    expect(newShip.hits()).toBe(2);
})


it('Length returned', () => {
    let newShip = new Ship(4,1,true);
    expect(newShip.shipLength()).toBe(4);
})

it('Sinking properly', () => {
    let newShip = new Ship(2,2);
    expect(newShip.isSunk()).toBe(true);
})

it("Attack works!",()=>{
    let newGameBoard = new Gameboard();
    newGameBoard.receiveAttack([0,1],[0,1]);
    expect(newGameBoard.actualAttacks).toEqual([[0,1]]);
})

it("Assign coordinates", () => {
    let newGameBoard = new Gameboard();
    let coords = [1,1];
    newGameBoard.receiveAttack([0,1],coords);
    expect(newGameBoard.attacks).toEqual([[0,1]]);
})