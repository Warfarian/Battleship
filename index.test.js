import { ship, gameBoard, players } from "./src/index.js";

it('Class created', () => {
    expect(ship).toBe(ship)
})


it('Game board created', () => {
    expect(gameBoard).toBe(gameBoard)
})


it('Players ready', () => {
    expect(players).toBe(players)
})
