import { Game } from "./Game";
import { GameField } from "./GameField";
import { GameView } from "./GameView";

import "./style.css";

const gameField = new GameField(5, 5);
const gameView = new GameView(document.querySelector("#app"));
const game = new Game(gameField, gameView, 500);
