import { Game } from "./Game";
import { GameState } from "./GameState";
import { GameView } from "./GameView";

import "./style.css";

const gameState = new GameState(10, 10);
const gameView = new GameView();
const game = new Game(gameState, gameView, 500);
game.run();
