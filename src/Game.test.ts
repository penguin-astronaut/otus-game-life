import { Game } from "./Game";
import { GameState } from "./GameState";
import { GameView } from "./GameView";

describe("Game", () => {
  let game: Game;
  let gameState: GameState;
  const speed = 200;
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    const gameView = new GameView();
    gameState = new GameState(3, 3);
    game = new Game(gameState, gameView, speed);
    game.run();
  });

  it("gameInit", () => {
    expect(document.querySelectorAll(".field__col").length).toBe(9);
  });

  it("changeState and View on cell Click", () => {
    const elem = document.querySelector(".field__col") as HTMLElement;
    expect(elem.classList.contains("field__col--undead")).toBeFalsy();
    elem.click();
    expect(
      (document.querySelector(".field__col") as HTMLElement).classList.contains(
        "field__col--undead"
      )
    ).toBeTruthy();
    expect(gameState.getState()).toEqual([
      [2, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("changeState speed in View and in Game", () => {
    const elem = document.querySelector(".controls__speed") as HTMLInputElement;
    elem.value = "1500";
    expect(game.getSpeed()).toBe(speed);
    elem.dispatchEvent(new Event("change"));
    expect(game.getSpeed()).toBe(1500);
  });

  it("changeSize", () => {
    (
      document.querySelector(".controls-size__item--col") as HTMLInputElement
    ).value = "4";
    (
      document.querySelector(".controls-size__item--row") as HTMLInputElement
    ).value = "5";
    (document.querySelector(".field__col") as HTMLLIElement).click();
    document
      .querySelector(".controls-size__item")
      .dispatchEvent(new Event("change", { bubbles: true }));
    expect(document.querySelectorAll(".field__col").length).toBe(20);
    expect(gameState.getState()).toEqual([
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });

  it("play/stop game", async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    (
      document.querySelector(
        '[data-col="0"][data-row="0"].field__col'
      ) as HTMLElement
    ).click();
    (
      document.querySelector(
        '[data-col="1"][data-row="0"].field__col'
      ) as HTMLElement
    ).click();
    (
      document.querySelector(
        '[data-col="2"][data-row="0"].field__col'
      ) as HTMLElement
    ).click();
    (
      document.querySelector(
        '[data-col="1"][data-row="1"].field__col'
      ) as HTMLElement
    ).click();

    (
      document.querySelector(".controls__play") as HTMLButtonElement
    ).dispatchEvent(new Event("click"));
    await delay(speed);
    expect(
      document
        .querySelector(".controls__play")
        .classList.contains("controls__play--stop")
    ).toBeTruthy();
    expect(game.getStatus()).toBeTruthy();
    expect(gameState.getState()).toEqual([
      [1, 2, 1],
      [1, 2, 1],
      [0, 0, 0],
    ]);
    await delay(speed);
    expect(gameState.getState()).toEqual([
      [2, 0, 2],
      [1, 0, 1],
      [0, 1, 0],
    ]);
    await delay(speed);
    expect(gameState.getState()).toEqual([
      [0, 0, 0],
      [2, 0, 2],
      [0, 1, 0],
    ]);
    await delay(speed);
    expect(gameState.getState()).toEqual([
      [0, 0, 0],
      [0, 2, 0],
      [0, 2, 0],
    ]);
    await delay(speed);
    expect(gameState.getState()).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    expect(
      document
        .querySelector(".controls__play")
        .classList.contains(".controls__play--stop")
    ).toBeFalsy();
    expect(game.getStatus()).toBeFalsy();
  });
});
