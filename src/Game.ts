import { IGameField } from "./GameField";
import { IGameView } from "./GameView";

export interface IGame {
  run(): void;
  stop(): void;
  updateSpeed(): void;
  runInterval(): void;
}

export class Game {
  private interval: any;

  private speed: number;

  private gameField: IGameField;

  private gameView: IGameView;

  private isRunning: boolean;

  constructor(gameField: IGameField, gameView: IGameView, stepDuration = 2000) {
    this.gameField = gameField;
    this.gameView = gameView;
    this.speed = stepDuration;
  }

  run = (): void => {
    const state = this.gameField.getState();
    this.gameView.updateGameField(state);
    this.gameView.updateGameState({
      isRunning: false,
      width: state[0].length,
      height: state.length,
      speed: this.speed,
    });

    this.gameView.onCellClick((x: number, y: number): void => {
      this.gameField.toggleCellState(x, y);
      this.gameView.updateGameField(this.gameField.getState());
    });

    this.gameView.onFieldSizeChange((width: number, height: number): void => {
      this.gameField.setSize(width, height);
      this.gameView.updateGameField(this.gameField.getState(false));
      this.gameView.updateGameState({ width, height });
    });

    this.gameView.onGameStateChange((newState: boolean): void => {
      if (!newState) {
        this.stop();
        return;
      }

      this.gameView.updateGameState({ isRunning: newState });
      this.isRunning = newState;
      this.runInterval();
    });

    this.gameView.onSpeedChange(this.updateSpeed);
  };

  stop = (): void => {
    this.gameView.updateGameState({ isRunning: false });
    clearInterval(this.interval);
    this.isRunning = false;
  };

  updateSpeed = (speed: number): void => {
    this.speed = speed;
    if (this.isRunning) {
      clearInterval(this.interval);
      this.runInterval();
    }
  };

  private runInterval = (): void => {
    this.interval = setInterval(() => {
      this.gameField.nextGeneration();
      const stateNew = this.gameField.getState();
      const sum = stateNew.reduce(
        (acc: number, item: number[]) =>
          acc +
          item.reduce((accIn: number, itemIn: number) => accIn + itemIn, 0),
        0
      );
      this.gameView.updateGameField(stateNew);
      if (!sum) {
        this.stop();
      }
    }, this.speed);
  };
}
