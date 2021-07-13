import { GameState } from "./GameState";
import { Field } from "./Types";

describe("game View", () => {
  let gameState: GameState;
  beforeEach(() => {
    gameState = new GameState(5, 5);
  });

  it("changeCellState", () => {
    const state: Field = gameState.getState(false);
    expect(state.length).toBe(5);
    expect(state[0].length).toBe(5);
    expect(state[0][0]).toBe(0);
    gameState.changeCellState(0, 0);
    expect(gameState.getState(false)[0][0]).toBe(1);
    expect(gameState.getState()[0][0]).toBe(2);
  });

  it("clearState", () => {
    gameState.changeCellState(0, 0);
    gameState.changeCellState(0, 1);
    gameState.changeCellState(0, 2);
    gameState.changeCellState(3, 4);

    expect(gameState.getState(false)).toEqual([
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
    ]);
    expect(gameState.getState()).toEqual([
      [2, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0],
    ]);

    gameState.clearState();
    expect(gameState.getState()).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
});
