import { GameView } from "./GameView";
import { Field } from "./Types";

describe("game View", () => {
  let gameView: GameView;
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    gameView = new GameView();
  });

  it("init template", () => {
    expect(document.querySelector(".field")).not.toBeNull();
    expect(
      document.querySelectorAll('input[type="number"].controls-size__item')
        .length
    ).toBe(2);
    expect(
      document.querySelectorAll('inpit[type="range"].controls__speed')
    ).not.toBeNull();
    expect(document.querySelector(".controls__play")).not.toBeNull();
    expect(document.querySelector(".controls__clear")).not.toBeNull();
  });

  it("updateField", () => {
    const state: Field = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 2, 2],
    ];
    gameView.updateField(state);
    const cells = document.querySelectorAll(".field__col");
    const alive = document.querySelectorAll(".field__col--alive");
    const undead = document.querySelectorAll(".field__col--undead");
    expect(cells.length).toBe(9);
    expect(alive.length).toBe(1);
    expect(undead.length).toBe(2);

    const aliveElem = document.querySelector(
      ".field__col--alive"
    ) as HTMLElement;
    expect(aliveElem.dataset.col).toBe("1");
    expect(aliveElem.dataset.row).toBe("1");

    const undeadElem = document.querySelector(
      ".field__col--undead"
    ) as HTMLElement;
    expect(undeadElem.dataset.col).toBe("1");
    expect(undeadElem.dataset.row).toBe("2");
  });

  it("updateActionsValues", () => {
    gameView.updateActionsValues({
      cols: 5,
      rows: 10,
      isRunning: true,
      speed: 20,
    });
    expect(
      (document.querySelector(".controls__speed") as HTMLInputElement).value
    ).toBe("20");
    expect(
      (document.querySelector(".controls-size__item--col") as HTMLInputElement)
        .value
    ).toBe("5");
    expect(
      (document.querySelector(".controls-size__item--row") as HTMLInputElement)
        .value
    ).toBe("10");
    expect(document.querySelector(".controls__play--stop")).not.toBeNull();
    gameView.updateActionsValues({ cols: 7 });
    expect(
      (document.querySelector(".controls-size__item--col") as HTMLInputElement)
        .value
    ).toBe("7");
  });

  it("onCellClick", () => {
    const myCb = jest.fn();
    gameView.onCellClick(myCb);
    const state: Field = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 2, 2],
    ];
    gameView.updateField(state);
    const undead = document.querySelectorAll(".field__col--undead");
    (undead[1] as HTMLElement).click();
    expect(myCb).toHaveBeenCalledWith(2, 2);
  });

  it("fieldSizeChange", () => {
    const myCb = jest.fn();
    gameView.onFieldSizeChange(myCb);
    (
      document.querySelector(".controls-size__item--col") as HTMLInputElement
    ).value = "50";
    (
      document.querySelector(".controls-size__item--row") as HTMLInputElement
    ).value = "25";
    document
      .querySelector(".controls-size__item")
      .dispatchEvent(new Event("change", { bubbles: true }));
    expect(myCb).toHaveBeenCalledWith(50, 25);
  });
  it("onGameStateChange", () => {
    const myCb = jest.fn();
    gameView.onGameStateChange(myCb);
    const btnRun = document.querySelector(
      ".controls__play"
    ) as HTMLInputElement;
    btnRun.click();
    expect(myCb).toHaveBeenCalledWith(true);
    btnRun.classList.add("controls__play--stop");
    btnRun.click();
    expect(myCb).toHaveBeenCalledWith(false);
  });

  it("onFieldClear", () => {
    const myCb = jest.fn();
    gameView.onFieldClear(myCb);
    (document.querySelector(".controls__clear") as HTMLInputElement).click();
    expect(myCb).toHaveBeenCalled();
  });
  it("onSpeedChange", () => {
    const myCb = jest.fn();
    gameView.onSpeedChange(myCb);
    const speedRange = document.querySelector(
      ".controls__speed"
    ) as HTMLInputElement;
    speedRange.value = "40";
    document
      .querySelector(".controls__speed")
      .dispatchEvent(new Event("change"));
    expect(myCb).toHaveBeenCalledWith(40);
  });
});
