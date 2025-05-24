// src/games/craps/CrapsGame.ts

export interface IObserver {
  update(subject: CrapsGameManager): void;
}

export interface CrapsGameState {
  dice: number[];
  message: string;
  isGameOver: boolean;
  point: number | null;
  isFirstRoll: boolean;
}

export class CrapsGameManager {
  private observers: IObserver[] = [];

  private dice: number[] = [1, 1];
  private message: string = "Willkommen bei Craps! Drücke 'Roll Dice', um zu starten.";
  private isGameOver: boolean = false;
  private point: number | null = null;
  private isFirstRoll: boolean = true;

  public addObserver(observer: IObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  private rollSingleDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  public rollDice(): void {
    if (this.isGameOver) return;

    const die1 = this.rollSingleDie();
    const die2 = this.rollSingleDie();
    this.dice = [die1, die2];
    const total = die1 + die2;

    if (this.isFirstRoll) {
      if ([7, 11].includes(total)) {
        this.message = `Du hast ${total} geworfen – Sofortiger Sieg! 🎉`;
        this.isGameOver = true;
      } else if ([2, 3, 12].includes(total)) {
        this.message = `Du hast ${total} geworfen – Craps! Verloren. 😢`;
        this.isGameOver = true;
      } else {
        this.point = total;
        this.message = `Point ist gesetzt auf ${total}. Würfle nochmal!`;
        this.isFirstRoll = false;
      }
    } else {
      if (total === this.point) {
        this.message = `Du hast deinen Point ${total} erneut getroffen – Du gewinnst! 🎉`;
        this.isGameOver = true;
      } else if (total === 7) {
        this.message = `Du hast 7 geworfen – Du verlierst. 😢`;
        this.isGameOver = true;
      } else {
        this.message = `Du hast ${total} geworfen. Versuche deinen Point (${this.point}) zu treffen.`;
      }
    }

    this.notifyObservers();
  }

  public resetGame(): void {
    this.dice = [1, 1];
    this.message = "Willkommen bei Craps! Drücke 'Roll Dice', um zu starten.";
    this.isGameOver = false;
    this.point = null;
    this.isFirstRoll = true;
    this.notifyObservers();
  }

  public getState(): CrapsGameState {
    return {
      dice: this.dice,
      message: this.message,
      isGameOver: this.isGameOver,
      point: this.point,
      isFirstRoll: this.isFirstRoll,
    };
  }
}
