import { Field } from "./Types";

export class GameView {
  constructor() {
    document.querySelector("#app").innerHTML = `
      <div class="field"></div>
      <div class="controls">
        <div class="controls-size">
          <label>Col: <input class="controls-size__item controls-size__item--col" type="number"></label>
          <label>Row: <input class="controls-size__item controls-size__item--row" type="number"></label>
        </div>
        <label>Speed <input class="controls__speed" type="range" min=0 max=99></label>
        <div class="controls-buttons">
          <button class="controls__play"></button>
          <button class="controls__clear">Clear Field</button>
        </div>
       
      </div>
    `;
  }

  updateField(state: Field) {
    const field = document.querySelector(".field") as HTMLElement;
    field.innerHTML = "";

    for (let row = 0; row < state.length; row += 1) {
      const rowElem = document.createElement("div");
      rowElem.classList.add("field__row");
      for (let col = 0; col < state[row].length; col += 1) {
        const colElem = document.createElement("div");
        colElem.classList.add("field__col");
        colElem.dataset.col = col.toString();
        colElem.dataset.row = row.toString();

        if (state[row][col] === 1) {
          colElem.classList.add("field__col--alive");
        } else if (state[row][col] === 2) {
          colElem.classList.add("field__col--undead");
        }
        rowElem.appendChild(colElem);
      }
      field.appendChild(rowElem);
    }
  }

  updateActionsValues(state: {
    cols?: number;
    rows?: number;
    isRunning?: boolean;
    speed?: number;
  }): void {
    const { cols, rows, isRunning, speed } = state;
    const btnRun: HTMLElement = document.querySelector(".controls__play");
    const inputWidth: HTMLInputElement = document.querySelector(
      ".controls-size__item.controls-size__item--col"
    );
    const inputHeight: HTMLInputElement = document.querySelector(
      ".controls-size__item.controls-size__item--row"
    );
    const inputSpeed: HTMLInputElement =
      document.querySelector(".controls__speed");
    if (isRunning !== undefined) {
      if (isRunning) {
        btnRun.classList.add("controls__play--stop");
      } else {
        btnRun.classList.remove("controls__play--stop");
      }
    }

    if (cols !== undefined) {
      inputWidth.value = cols.toString();
    }
    if (rows !== undefined) {
      inputHeight.value = rows.toString();
    }

    if (speed !== undefined) {
      inputSpeed.value = speed.toString();
    }
  }

  onCellClick(cb: (col: number, row: number) => void): void {
    document.querySelector(".field").addEventListener("click", (e: Event) => {
      const elem = e.target as HTMLElement;
      if (elem.dataset.col === undefined) {
        return;
      }
      cb(Number(elem.dataset.col), Number(elem.dataset.row));
    });
  }

  onGameStateChange(cb: (newState: boolean) => void): void {
    document
      .querySelector(".controls__play")
      .addEventListener("click", (e: MouseEvent) => {
        const btnRun = e.target as HTMLElement;
        const newState = !btnRun.classList.contains("controls__play--stop");
        cb(newState);
      });
  }

  onFieldSizeChange(cb: (width: number, height: number) => void): void {
    document
      .querySelector(".controls-size")
      .addEventListener("change", (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (!input.classList.contains("controls-size__item")) {
          return;
        }
        const inputWidth: HTMLInputElement = document.querySelector(
          ".controls-size__item--col"
        );
        const inputHeight: HTMLInputElement = document.querySelector(
          ".controls-size__item--row"
        );
        const width = Number(inputWidth.value);
        const height = Number(inputHeight.value);
        cb(width, height);
      });
  }

  onFieldClear(cb: () => void): void {
    document.querySelector(".controls__clear").addEventListener("click", () => {
      cb();
    });
  }

  onSpeedChange(cb: (timeMs: number) => void): void {
    document
      .querySelector(".controls__speed")
      .addEventListener("change", () => {
        const elem = document.querySelector(
          ".controls__speed"
        ) as HTMLInputElement;
        cb(Number(elem.value));
      });
  }
}
