export interface IObserver {
  update(): void;
}

export interface Horse {
  name: string;
  position: number; // 0–10
}

export interface HorseRaceState {
  horses: Horse[];
  message: string;
  isRaceRunning: boolean;
  winner: string | null;
  selectedHorse: string | null;
  betResult: "win" | "lose" | null;
}

export class HorseRaceGameManager {
  private observers: IObserver[] = [];
  private horses: Horse[] = [
    { name: "Blitz", position: 0 },
    { name: "Donner", position: 0 },
    { name: "Sturm", position: 0 },
  ];
  private isRaceRunning: boolean = false;
  private winner: string | null = null;
  private selectedHorse: string | null = null;
  private betResult: "win" | "lose" | null = null;
  private message: string = "Wähle dein Pferd und starte das Rennen!";
  private raceInterval: any = null;

  public addObserver(observer: IObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update();
    }
  }

  public getState(): HorseRaceState {
    return {
      horses: this.horses.map((h) => ({ ...h })),
      isRaceRunning: this.isRaceRunning,
      winner: this.winner,
      message: this.message,
      selectedHorse: this.selectedHorse,
      betResult: this.betResult,
    };
  }

  public selectHorse(name: string): void {
    if (this.isRaceRunning || this.winner) return;
    if (!this.horses.find((h) => h.name === name)) return;

    this.selectedHorse = name;
    this.message = `Du hast auf ${name} gewettet. Viel Glück! 🍀`;
    this.notifyObservers();
  }

  public startRace(): void {
    if (this.isRaceRunning || this.winner !== null) return;

    this.isRaceRunning = true;
    this.message = "🏁 Das Rennen läuft!";
    this.notifyObservers();

    this.raceInterval = setInterval(() => {
      for (const horse of this.horses) {
        horse.position += Math.random() < 0.5 ? 1 : 0;
        if (horse.position >= 10) {
          this.isRaceRunning = false;
          this.winner = horse.name;

          if (this.selectedHorse) {
            this.betResult = this.selectedHorse === this.winner ? "win" : "lose";
            this.message =
              this.betResult === "win"
                ? `🎉 ${horse.name} gewinnt – Du hast richtig gewettet!`
                : `🏁 ${horse.name} gewinnt – Du hast verloren.`;
          } else {
            this.message = `🏁 ${horse.name} gewinnt das Rennen!`;
          }

          clearInterval(this.raceInterval);
          break;
        }
      }
      this.notifyObservers();
    }, 500);
  }

  public resetRace(): void {
    if (this.raceInterval) clearInterval(this.raceInterval);

    this.horses.forEach((h) => (h.position = 0));
    this.isRaceRunning = false;
    this.winner = null;
    this.selectedHorse = null;
    this.betResult = null;
    this.message = "Wähle dein Pferd und starte das Rennen!";
    this.notifyObservers();
  }
}
