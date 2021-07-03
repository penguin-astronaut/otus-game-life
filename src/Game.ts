import { IGameField } from "./GameField";
import { IGameView } from "./GameView";

export class Game {
  private interval: any;

  constructor(
    gameField: IGameField,
    gameView: IGameView,
    stepDuration = 2000
  ) {
    const state = gameField.getState();
    gameView.updateGameField(state);
    gameView.updateGameState({
      isRunning: false,
      width: state[0].length,
      height: state.length,
    });

    gameView.onCellClick((x: number, y: number): void => {
      gameField.toggleCellState(x, y);
      gameView.updateGameField(gameField.getState());
    });

    gameView.onFieldSizeChange((width: number, height: number): void => {
      gameField.setSize(width, height);
      gameView.updateGameField(gameField.getState());
      gameView.updateGameState({ width, height });
    });

    gameView.onGameStateChange((newState: boolean): void => {
      gameView.updateGameState({ isRunning: newState });
      if (!newState) {
        clearInterval(this.interval);
        gameView.updateGameField(gameField.getState());
        return;
      }
      gameField.nextGeneration();

      gameView.updateGameField(gameField.getState());

      this.interval = setInterval(() => {
        gameField.nextGeneration();
        const stateNew = gameField.getState();
        const sum = stateNew.reduce(
          (acc: number, item: number[]) =>
            acc +
            item.reduce((accIn: number, itemIn: number) => accIn + itemIn, 0),
          0
        );
        if (!sum) {
          gameView.updateGameState({ isRunning: false });
          clearInterval(this.interval);
          gameView.updateGameField(gameField.getState());
          return;
        }
        gameView.updateGameField(stateNew);
      }, stepDuration);
    });
  }
}
