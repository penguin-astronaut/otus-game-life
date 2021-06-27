import { GameView } from './GameView';

describe('GameView', () => {
  let el: HTMLElement;
  beforeEach(() => {
    el = document.createElement('div');
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });
  describe('public interface', () => {
    it('is a class', () => {
      expect(GameView).toBeInstanceOf(Function);
      expect(new GameView(el)).toBeInstanceOf(GameView);
    });

    it('renders some inital markup on construction', () => {
      const gameView = new GameView(el);

      expect(document.querySelector('.gameField')).not.toBeNull();
      expect(document.querySelector('.gameControls')).not.toBeNull();
    });

    it('has public methods', () => {
      const gameView = new GameView(el);
      expect(gameView.updateGameField).toBeInstanceOf(Function);
      expect(gameView.updateGameState).toBeInstanceOf(Function);
      expect(gameView.onCellClick).toBeInstanceOf(Function);
      expect(gameView.onGameStateChange).toBeInstanceOf(Function);
      expect(gameView.onFieldSizeChange).toBeInstanceOf(Function);
    });
  });

  describe('functional interface', () => {
    let gameView: GameView;
    beforeEach(() => {
      gameView = new GameView(el);
    });

    it('renders field from .updateGameField', () => {
      gameView.updateGameField([
        [0, 1],
        [1, 0],
      ]);
      expect(document.querySelectorAll('.cell').length).toBe(4);
      expect(document.querySelectorAll('.cell.cell--alive').length).toBe(2);
      expect(document.querySelectorAll('.cell.cell--dead').length).toBe(2);
      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);
      expect(document.querySelectorAll('.cell').length).toBe(4);
      expect(document.querySelectorAll('.cell.cell--alive').length).toBe(1);
      expect(document.querySelectorAll('.cell.cell--dead').length).toBe(3);
      gameView.updateGameField([
        [0, 0, 1],
        [1, 0, 1],
      ]);
      expect(document.querySelectorAll('.cell').length).toBe(6);
      expect(document.querySelectorAll('.cell.cell--alive').length).toBe(3);
      expect(document.querySelectorAll('.cell.cell--dead').length).toBe(3);
    });
    it('calls funciton from .onCellClick on field interaction', () => {
      const onCellClick = jest.fn();
      gameView.onCellClick(onCellClick);
      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);

      document.querySelector('.cell.cell--alive').dispatchEvent(
        new Event('click', {
          bubbles: true,
        }),
      );
      expect(onCellClick).toHaveBeenCalledWith(0, 1);
      document.querySelectorAll('.cell.cell--dead')[1].dispatchEvent(
        new Event('click', {
          bubbles: true,
        }),
      );
      expect(onCellClick).toHaveBeenCalledWith(1, 0);
    });
    it('renders correct game state on .updateGameState', () => {
      expect(
        document.querySelector('.run-button.run-button--stopped'),
      ).not.toBeNull();
      expect(
        document.querySelector('.run-button.run-button--stopped').innerHTML,
      ).toBe('Play');
      gameView.updateGameState({ isRunning: true, width: 3, height: 3 });
      expect(
        document.querySelector('.run-button.run-button--stopped'),
      ).toBeNull();
      expect(
        document.querySelector('.run-button.run-button--runned'),
      ).not.toBeNull();
      expect(
        document.querySelector('.run-button.run-button--runned').innerHTML,
      ).toBe('Stop');
      expect(
        Number(
          (
            document.querySelector(
              "input[type='number'].field-size.field-size--width",
            ) as HTMLInputElement
          ).value,
        ),
      ).toBe(3);
      expect(
        Number(
          (
            document.querySelector(
              "input[type='number'].field-size.field-size--height",
            ) as HTMLInputElement
          ).value,
        ),
      ).toBe(3);
      gameView.updateGameState({ isRunning: false, width: 5, height: 6 });
      expect(
        document.querySelector('.run-button.run-button--stopped'),
      ).not.toBeNull();
      expect(
        document.querySelector('.run-button.run-button--stopped').innerHTML,
      ).toBe('Play');
      expect(
        Number(
          (
            document.querySelector(
              "input[type='number'].field-size.field-size--width",
            ) as HTMLInputElement
          ).value,
        ),
      ).toBe(5);
      expect(
        Number(
          (
            document.querySelector(
              "input[type='number'].field-size.field-size--height",
            ) as HTMLInputElement
          ).value,
        ),
      ).toBe(6);
    });
    it('calls function from .onGameStateChange on control interaction', () => {
      const onGameStateChange = jest.fn();
      gameView.onGameStateChange(onGameStateChange);
      gameView.updateGameState({ isRunning: true, width: 2, height: 1 });
      document.querySelector('.run-button.run-button--runned').dispatchEvent(
        new Event('click', {
          bubbles: true,
        }),
      );
      expect(onGameStateChange).toHaveBeenCalledWith(false);
      gameView.updateGameState({ isRunning: false, width: 2, height: 1 });
      document.querySelector('.run-button.run-button--stopped').dispatchEvent(
        new Event('click', {
          bubbles: true,
        }),
      );
      expect(onGameStateChange).toHaveBeenCalledWith(true);
    });
    it('calls onFieldSizeChange on field size change interaction', () => {
      const onFieldSizeChange = jest.fn();
      gameView.onFieldSizeChange(onFieldSizeChange);

      [
        [33, 66],
        [22, 12],
        [1, 2],
      ].forEach(([width, height]) => {
        (
          document.querySelector(
            "input[type='number'].field-size.field-size--width",
          ) as HTMLInputElement
        ).value = `${width}`;
        (
          document.querySelector(
            "input[type='number'].field-size.field-size--height",
          ) as HTMLInputElement
        ).value = `${height}`;
        (
          document.querySelector(
            "input[type='number'].field-size.field-size--width",
          ) as HTMLInputElement
        ).dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );
        expect(onFieldSizeChange).toHaveBeenCalledWith(width, height);
      });

      [
        [101, 103],
        [104, 105],
        [106, 107],
      ].forEach(([width, height]) => {
        (
          document.querySelector(
            "input[type='number'].field-size.field-size--width",
          ) as HTMLInputElement
        ).value = `${width}`;
        (
          document.querySelector(
            "input[type='number'].field-size.field-size--height",
          ) as HTMLInputElement
        ).value = `${height}`;
        (
          document.querySelector(
            "input[type='number'].field-size.field-size--height",
          ) as HTMLInputElement
        ).dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );
        expect(onFieldSizeChange).toHaveBeenCalledWith(width, height);
      });
    });
  });
});
