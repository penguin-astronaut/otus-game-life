import { Field } from "./types/Field";

export interface IGameView {
  updateGameField(field: Field): void;
  updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
    speed?: number;
  }): void;
  onCellClick(cb: (x: number, y: number) => void): void;
  onGameStateChange(cb: (newState: boolean) => void): void;
  onFieldSizeChange(cb: (width: number, height: number) => void): void;
  onSpeedChange(cb: (timeMs: number) => void): void;
}

export class GameView implements IGameView {
  constructor(el: HTMLElement) {
    const element: HTMLElement = el;
    element.innerHTML = `
      <table class='gameField'></table>
      <div class='gameControls'>
        <button class='run-button run-button--stopped'>Play</button>
        <input type='number' class='field-size field-size--width'/>
        <input type='number' class='field-size field-size--height'/>
        <input type='range' class='field-speed' min="100" max="3000" />
      </div>
    `;
    document.body.appendChild(element);
  }

  updateGameField = (field: Field): void => {
    document.querySelector(".gameField").innerHTML = "";

    field.forEach((row) => {
      const tr = document.createElement("tr");

      row.forEach((col) => {
        const td = document.createElement("td");
        let stateClass: string;
        if (col === 2) {
          stateClass = "cell--undead";
        } else if (col === 1) {
          stateClass = "cell--alive";
        } else {
          stateClass = "cell--dead";
        }
        td.classList.add("cell", stateClass);
        tr.append(td);
      });

      document.querySelector(".gameField").append(tr);
    });
  };

  updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
    speed?: number;
  }): void {
    const { width, height, isRunning, speed } = state;
    const btnRun: HTMLElement = document.querySelector(".run-button");
    const inputWidth: HTMLInputElement = document.querySelector(
      ".field-size.field-size--width"
    );
    const inputHeight: HTMLInputElement = document.querySelector(
      ".field-size.field-size--height"
    );
    const inputSpeed: HTMLInputElement = document.querySelector(".field-speed");
    if (isRunning !== undefined) {
      if (isRunning) {
        btnRun.classList.remove("run-button--stopped");
        btnRun.classList.add("run-button--runned");
        btnRun.innerHTML = "Stop";
      } else {
        btnRun.classList.remove("run-button--runned");
        btnRun.classList.add("run-button--stopped");
        btnRun.innerHTML = "Play";
      }
    }

    if (width !== undefined) {
      inputWidth.value = state.width.toString();
    }
    if (height !== undefined) {
      inputHeight.value = state.height.toString();
    }

    if (speed !== undefined) {
      inputSpeed.value = state.speed.toString();
    }
  }

  onCellClick(cb: (x: number, y: number) => void): void {
    document
      .querySelector(".gameField")
      .addEventListener("click", (e: Event) => {
        const cell: HTMLTableCellElement = e.target as HTMLTableCellElement;
        const row: HTMLTableRowElement = cell.parentNode as HTMLTableRowElement;
        const x = cell.cellIndex;
        const y = row.rowIndex;

        cb(x, y);
      });
  }

  onGameStateChange(cb: (newState: boolean) => void): void {
    document
      .querySelector(".run-button")
      .addEventListener("click", (e: MouseEvent) => {
        const btnRun = e.target as HTMLElement;
        const newState = btnRun.innerHTML === "Play";
        cb(newState);
      });
  }

  onFieldSizeChange(cb: (width: number, height: number) => void): void {
    document
      .querySelector(".gameControls")
      .addEventListener("change", (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (!input.classList.contains("field-size")) {
          return;
        }
        const inputWidth: HTMLInputElement = document.querySelector(
          ".field-size.field-size--width"
        );
        const inputHeight: HTMLInputElement = document.querySelector(
          ".field-size.field-size--height"
        );
        const width = Number(inputWidth.value);
        const height = Number(inputHeight.value);
        cb(width, height);
      });
  }

  onSpeedChange(cb: (timeMs: number) => void): void {
    document.querySelector(".field-speed").addEventListener("change", () => {
      const elem = document.querySelector(".field-speed") as HTMLInputElement;
      cb(Number(elem.value));
    });
  }
}
