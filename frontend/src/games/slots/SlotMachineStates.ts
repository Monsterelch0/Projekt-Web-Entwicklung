// src/games/slots/SlotMachineStates.ts

// Interface for the State
interface ISlotMachineState {
  spin(): void;
  getName(): string;
  getMessage(): string;
}

// Context class that uses a State
export class SlotMachineGame {
  private currentState: ISlotMachineState;
  public reels: string[][] = [['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']]; // 3 reels, 3 symbols view
  public message: string;
  private setUiUpdate: () => void;

  constructor(setUiUpdate: () => void) {
    this.setUiUpdate = setUiUpdate;
    this.currentState = new IdleState(this);
    this.message = this.currentState.getMessage();
    this.updateUI(); 
  }

  public setState(newState: ISlotMachineState): void {
    this.currentState = newState;
    this.message = this.currentState.getMessage();
    this.updateUI();
  }

  public spin(): void {
    this.currentState.spin();
    // Message and UI update will be handled by the state or subsequent state transition
  }

  // Method to trigger React component re-render
  public updateUI(): void {
    this.setUiUpdate();
  }

  // Dummy spin logic
  public performSpinAction(): void {
    const symbols = ['🍒', '🍋', '🍊', '🍉', '🔔', '⭐'];
    for (let i = 0; i < this.reels.length; i++) {
      for (let j = 0; j < this.reels[i].length; j++) {
        this.reels[i][j] = symbols[Math.floor(Math.random() * symbols.length)];
      }
    }

    // Dummy win check
    if (this.reels[0][1] === this.reels[1][1] && this.reels[1][1] === this.reels[2][1]) {
      this.message = `JACKPOT! You won with ${this.reels[1][1]}!`;
    } else {
      this.message = "Spin resulted in no win. Try again!";
    }
  }

  public getCurrentStateName(): string {
    return this.currentState.getName();
  }
}

// --- Concrete States ---

class IdleState implements ISlotMachineState {
  private context: SlotMachineGame;

  constructor(context: SlotMachineGame) {
    this.context = context;
  }

  getName(): string { return "Idle"; }
  getMessage(): string { return "Press Spin to Start!"; }

  spin(): void {
    this.context.setState(new SpinningState(this.context));
    this.context.getCurrentStateName();
  }
}

class SpinningState implements ISlotMachineState {
  private context: SlotMachineGame;

  constructor(context: SlotMachineGame) {
    this.context = context;
    this.initiateSpin();
  }

  getName(): string { return "Spinning"; }
  getMessage(): string { return "Reels are spinning..."; }

  private initiateSpin(): void {
    // Show temporary symbols
    this.context.reels = [['🌀', '🌀', '🌀'], ['🌀', '🌀', '🌀'], ['🌀', '🌀', '🌀']];
    this.context.updateUI();

    
    setTimeout(() => {
      this.context.performSpinAction();
      this.context.setState(new ResultsState(this.context));
    }, 1500); // 1.5 second spin
  }

  spin(): void {
    this.context.updateUI();
  }
}

class ResultsState implements ISlotMachineState {
  private context: SlotMachineGame;
  constructor(context: SlotMachineGame) {
    this.context = context;
  }

  getName(): string { return "Results"; }
  getMessage(): string { return this.context.message; }

  spin(): void {
    this.context.setState(new IdleState(this.context));
    this.context.spin();
  }
}