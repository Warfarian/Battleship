import { newPlayer } from "./src";


it("New players and gameBoards created",()=>{
    newPlayer.Gameboard.receiveAttack([0,1],[0,1]);
    expect(newPlayer.Gameboard.actualAttacks).toEqual([[0,1]]);
})