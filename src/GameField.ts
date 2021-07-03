import { Field } from "./types/Field";

export interface IGameField {
  getState(): number[][];
  toggleCellState(x: number, y: number): void;
  nextGeneration(): void;
  setSize(width: number, height: number): void;
}

export class GameField implements IGameField {
  private state: Field;

  constructor(width = 0, height = 1) {
    this.setSize(width, height);
  }

  countAliveAround = (x: number, y: number): number => {
    let count = 0;
    for (let rowNumber = y - 1; rowNumber <= y + 1; rowNumber += 1) {
      if (this.state[rowNumber] === undefined) {
        continue;
      }
      for (let columnNumber = x - 1; columnNumber <= x + 1; columnNumber += 1) {
        if (y === rowNumber && x === columnNumber) {
          continue;
        }
        if (this.state[rowNumber][columnNumber]) {
          count += 1;
        }
      }
    }
    return count;
  };

  getState = (): Field => this.state;

  toggleCellState = (x: number, y: number): void => {
    if (this.state[y] !== undefined && this.state[y][x] !== undefined) {
      this.state[y][x] = Number(!this.state[y][x]);
    }
  };

  nextGeneration = (): void => {
    const result: Field = [];

    for (let row = 0; row < this.state.length; row += 1) {
      result[row] = [];

      for (let col = 0; col < this.state[row].length; col += 1) {
        const liveAround = this.countAliveAround(col, row);
        const cell = this.state[row][col];

        if (liveAround === 3) {
          result[row][col] = 1;
        } else if (cell && liveAround === 2) {
          result[row][col] = 1;
        } else {
          result[row][col] = 0;
        }
      }
    }

    this.state = result;
  };

  setSize = (width: number, height: number): void => {
    const state: Field = [];

    for (let rowNumber = 0; rowNumber < height; rowNumber += 1) {
      const row: Array<number> = [];
      for (let columnNumber = 0; columnNumber < width; columnNumber += 1) {
        let val = 0;
        if (this.state) {
          val =
            this.state[rowNumber] && this.state[rowNumber][columnNumber]
              ? this.state[rowNumber][columnNumber]
              : 0;
        }
        row[columnNumber] = val;
      }

      state[rowNumber] = row;
    }
    this.state = state;
  };
}
