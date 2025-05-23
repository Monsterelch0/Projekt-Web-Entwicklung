// src/games/high-low/HighLowCommands.ts
// Receiver: Contains the core game logic
export class HighLowGameLogic {
  public currentNumber: number = 0;
  public nextNumber: number | null = null; 
  public score: number = 0;
  public message: string = "Click 'Start Game' to begin!";
  public gameOver: boolean = true;
  private minRange: number = 1;
  private maxRange: number = 10;

  constructor() {
    this.currentNumber = this.generateRandomNumber();
  }

  private generateRandomNumber(): number {
    return Math.floor(Math.random() * (this.maxRange - this.minRange + 1)) + this.minRange;
  }

  public startGame(): void {
    this.currentNumber = this.generateRandomNumber();
    this.nextNumber = null;
    this.score = 0;
    this.message = `First number is ${this.currentNumber}. Is the next number (1-${this.maxRange}) higher or lower?`;
    this.gameOver = false;
  }

  public guess(isHigherGuess: boolean): void {
    if (this.gameOver) {
      this.message = "Game is over. Please start a new game.";
      return;
    }

    this.nextNumber = this.generateRandomNumber();
    // Make sure nextNumber is different from currentNumber
    while (this.nextNumber === this.currentNumber) {
      this.nextNumber = this.generateRandomNumber();
    }

    let correctGuess = false;
    if (isHigherGuess && this.nextNumber > this.currentNumber) {
      correctGuess = true;
    } else if (!isHigherGuess && this.nextNumber < this.currentNumber) {
      correctGuess = true;
    }

    if (correctGuess) {
      this.score++;
      this.message = `Correct! The number was ${this.nextNumber}. Current number is now ${this.nextNumber}. Score: ${this.score}. Guess again!`;
      this.currentNumber = this.nextNumber;
    } else {
      this.message = `Wrong! The number was ${this.nextNumber}. Game Over! Final score: ${this.score}.`;
      this.gameOver = true;
    }
  }

  public cashOut(): void {
    if (this.gameOver) {
        this.message = "Game is already over. Final score: " + this.score;
        return;
    }
    this.message = `You cashed out with a score of ${this.score}. Game Over.`;
    this.gameOver = true;
  }
}

// Command Interface
export interface ICommand {
  execute(): void;
}

// Concrete Commands
export class StartGameCommand implements ICommand {
  constructor(
    private gameLogic: HighLowGameLogic,
    private uiUpdateCallback: () => void
  ) {}

  execute(): void {
    this.gameLogic.startGame();
    this.uiUpdateCallback();
  }
}

export class GuessCommand implements ICommand {
  constructor(
    private gameLogic: HighLowGameLogic,
    private isHigherGuess: boolean,
    private uiUpdateCallback: () => void
  ) {}

  execute(): void {
    this.gameLogic.guess(this.isHigherGuess);
    this.uiUpdateCallback();
  }
}

export class CashOutCommand implements ICommand {
  constructor(
    private gameLogic: HighLowGameLogic,
    private uiUpdateCallback: () => void
  ) {}

  execute(): void {
    this.gameLogic.cashOut();
    this.uiUpdateCallback();
  }
}