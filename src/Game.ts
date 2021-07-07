import { GameState } from "./GameState";
import { GameView } from "./GameView";

export class Game {
  private interval: number;

  public speed: number;

  private gameState: GameState;

  private gameView: GameView;

  private isRunning: boolean;

  constructor(gameState: GameState, gameView: GameView, speed = 2000) {
    this.gameState = gameState;
    this.gameView = gameView;
    this.speed = speed;
  }

  run = (): void => {
    const state = this.gameState.getState();
    this.gameView.updateField(state);
    this.gameView.updateActionsValues({
      isRunning: false,
      cols: state[0].length,
      rows: state.length,
      speed: this.speed,
    });

    this.gameView.onCellClick((x: number, y: number): void => {
      this.gameState.changeCellState(x, y);
      this.gameView.updateField(this.gameState.getState());
    });

    this.gameView.onFieldSizeChange((cols: number, rows: number): void => {
      this.gameState.setSize(cols, rows);
      this.gameView.updateField(this.gameState.getState(false));
      this.gameView.updateActionsValues({ cols, rows });
    });

    this.gameView.onGameStateChange((newState: boolean): void => {
      if (!newState) {
        this.stop();
        return;
      }

      this.gameView.updateActionsValues({ isRunning: newState });
      this.isRunning = newState;
      this.runInterval();
    });

    this.gameView.onSpeedChange(this.updateSpeed);
    this.gameView.onFieldClear(() => {
      this.gameState.clearState();
      this.gameView.updateField(this.gameState.getState());
      if (this.isRunning) {
        this.stop();
      }
    });
  };

  stop = (): void => {
    this.gameView.updateActionsValues({ isRunning: false });
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
    this.interval = window.setInterval(() => {
      this.gameState.nextGeneration();
      const stateNew = this.gameState.getState();
      const sum = stateNew.reduce(
        (acc: number, item: number[]) =>
          acc +
          item.reduce((accIn: number, itemIn: number) => accIn + itemIn, 0),
        0
      );
      this.gameView.updateField(stateNew);
      if (!sum) {
        this.stop();
      }
    }, this.speed);
  };
}
