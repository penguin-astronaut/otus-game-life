import { Field } from "./Types";

export class GameState {
  private state: Field;

  constructor(colCount: number, rowCount: number) {
    this.setSize(colCount, rowCount);
  }

  getState = (withNext = true): Field => {
    if (!withNext) {
      return this.state;
    }

    const nextState = this.getNextGeneration();
    for (let row = 0; row < this.state.length; row += 1) {
      for (let col = 0; col < this.state[0].length; col += 1) {
        if (this.state[row][col] === 1 && nextState[row][col] === 0) {
          this.state[row][col] = 2;
        } else if (this.state[row][col] === 2 && nextState[row][col] === 1) {
          this.state[row][col] = 1;
        }
      }
    }

    return this.state;
  };

  changeCellState = (col: number, row: number): void => {
    if (this.state[row][col] === 0) {
      this.state[row][col] = 1;
    } else {
      this.state[row][col] = 0;
    }
  };

  setSize = (width: number, height: number): void => {
    const state: Field = [];
    for (let rowNumber = 0; rowNumber < height; rowNumber += 1) {
      const row: Array<number> = [];
      for (let columnNumber = 0; columnNumber < width; columnNumber += 1) {
        let val = 0;
        if (this.state) {
          val =
            this.state[rowNumber] &&
            this.state[rowNumber][columnNumber] !== undefined
              ? this.state[rowNumber][columnNumber]
              : 0;
        }
        row[columnNumber] = val;
      }
      state[rowNumber] = row;
    }
    this.state = state;
  };

  clearState = (): void => {
    for (let rowNumber = 0; rowNumber < this.state.length; rowNumber += 1) {
      const row: Array<number> = [];
      for (
        let colNumber = 0;
        colNumber < this.state[0].length;
        colNumber += 1
      ) {
        this.state[rowNumber][colNumber] = 0;
      }
    }
  };

  checkReplayState = (): boolean => {
    const nextState = this.getNextGeneration();
    const stateAfterTwoMoves = this.getNextGeneration(nextState);
    return this.state.join().replace(/2/g, "1") === stateAfterTwoMoves.join();
  };

  nextGeneration = (): void => {
    this.state = this.getNextGeneration();
  };

  private getNextGeneration = (state?: Field): Field => {
    const result: Field = [];
    const curState = state ?? this.state;
    for (let row = 0; row < curState.length; row += 1) {
      result[row] = [];

      for (let col = 0; col < curState[row].length; col += 1) {
        const liveAround = this.countAliveAround(col, row, curState);
        const cell = curState[row][col];

        if (liveAround === 3 || (cell && liveAround === 2)) {
          result[row][col] = 1;
        } else {
          result[row][col] = 0;
        }
      }
    }
    return result;
  };

  private countAliveAround = (
    col: number,
    row: number,
    state: Field
  ): number => {
    let count = 0;
    for (let rowNumber = row - 1; rowNumber <= row + 1; rowNumber += 1) {
      if (state[rowNumber] === undefined) {
        continue;
      }
      for (
        let columnNumber = col - 1;
        columnNumber <= col + 1;
        columnNumber += 1
      ) {
        if (row === rowNumber && col === columnNumber) {
          continue;
        }
        if (state[rowNumber][columnNumber]) {
          count += 1;
        }
      }
    }
    return count;
  };
}
