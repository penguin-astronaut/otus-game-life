import { Game } from "./Game";
import { IGameField } from "./GameField";
import { IGameView } from "./GameView";
import { Field } from "./types/Field";

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

describe("Game", () => {
  const stepDurationMs = 10;
  let state: Field;
  let gameField: IGameField;
  let gameView: IGameView;
  let onGameStateChange = jest.fn();
  let onFieldSizeChange = jest.fn();
  let onCellClick = jest.fn();
  let onSpeedChange = jest.fn();

  const getGameField = (): IGameField => ({
    getState: jest.fn(() => state),
    toggleCellState: jest.fn(),
    nextGeneration: jest.fn(),
    setSize: jest.fn(),
  });

  const getGameView = (): IGameView => ({
    updateGameField: jest.fn(),
    updateGameState: jest.fn(),
    onCellClick: jest.fn((cb) => {
      onCellClick = jest.fn(cb);
    }),
    onGameStateChange: jest.fn((cb) => {
      onGameStateChange = jest.fn(cb);
    }),
    onFieldSizeChange: jest.fn((cb) => {
      onFieldSizeChange = jest.fn(cb);
    }),
    onSpeedChange: jest.fn((cb) => {
      onSpeedChange = jest.fn(cb);
    }),
  });

  beforeEach(() => {
    state = [
      [Math.random(), Math.random()],
      [Math.random(), Math.random()],
      [Math.random(), Math.random()],
    ];
    gameView = getGameView();
    gameField = getGameField();
  });

  it("is a class", () => {
    expect(Game).toBeInstanceOf(Function);
    expect(new Game(gameField, gameView)).toBeInstanceOf(Game);
  });

  describe("functionality", () => {
    let game: Game;
    beforeEach(() => {
      game = new Game(gameField, gameView, stepDurationMs);
      game.run();
    });

    it("renders initial state on instantiating", () => {
      expect(gameField.getState).toHaveBeenCalled();
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
      expect(gameView.updateGameState).toHaveBeenCalledWith({
        isRunning: false,
        width: state[0].length,
        height: state.length,
        speed: stepDurationMs,
      });
    });

    it("calls field.toggleCellState on view.onCellClick and renders with updated state", () => {
      state = [[1, 2, 3]];
      onCellClick(0, 1);
      expect(gameField.toggleCellState).toHaveBeenCalledWith(0, 1);
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
    });

    it("calls field.setSize on view.onFieldSizeChange and renders with updated state", () => {
      state = [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ];
      const width = state[0].length;
      const height = state.length;
      onFieldSizeChange(width, height);
      expect(gameField.setSize).toHaveBeenCalledWith(width, height);
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
      expect(gameView.updateGameState).toHaveBeenCalledWith(
        expect.objectContaining({
          width,
          height,
        })
      );
    });

    it("is able to start/stop game with onGameStateChange", async () => {
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      await sleep(stepDurationMs);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      await sleep(stepDurationMs);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);

      onGameStateChange(true);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
      expect(gameField.getState).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(2);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameField.getState).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);

      onGameStateChange(false);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
      expect(gameField.getState).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameField.getState).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      await sleep(stepDurationMs);
      expect(gameField.getState).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
    });

    it("on speed change", async () => {
      onSpeedChange(5000);
      expect(game.speed).toBe(5000);
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
    });
  });
});
