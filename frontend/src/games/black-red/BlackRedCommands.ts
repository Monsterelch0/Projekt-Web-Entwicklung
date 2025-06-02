// src/games/black-red/BlackRedCommands.ts

import { BlackRedGameLogic } from './BlackRedGameLogic';

export interface ICommand {
  execute(): void;
}

export class StartGameCommand implements ICommand {
  constructor(
    private gameLogic: BlackRedGameLogic,
    private uiUpdateCallback: () => void
  ) {}

  execute(): void {
    this.gameLogic.startGame();
    this.uiUpdateCallback();
  }
}

export class GuessCommand implements ICommand {
  constructor(
    private gameLogic: BlackRedGameLogic,
    private isRedGuess: boolean,
    private uiUpdateCallback: () => void
  ) {}

  execute(): void {
    this.gameLogic.guess(this.isRedGuess);
    this.uiUpdateCallback();
  }
}

export class CashOutCommand implements ICommand {
  constructor(
    private gameLogic: BlackRedGameLogic,
    private uiUpdateCallback: () => void
  ) {}

  execute(): void {
    this.gameLogic.cashOut();
    this.uiUpdateCallback();
  }
}
