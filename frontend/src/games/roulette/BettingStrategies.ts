// src/games/roulette/BettingStrategies.ts

export interface IBet {
  type: 'color' | 'number' | 'parity' | 'column' | 'dozen';
  target: string | number; // e.g., 'red', 5, 'even', 1 (for 1st column/dozen)
  amount: number;
  displayName?: string; // For UI representation of the bet
}

export interface IBettingStrategy {
  name: string;
  description: string;
  generateBets(currentBalance: number, minBet: number): IBet[];
}

export class BetOnRedStrategy implements IBettingStrategy {
  name = "Bet on Red";
  description = "Places a fixed bet on Red.";
  generateBets(currentBalance: number, minBet: number): IBet[] {
    if (currentBalance >= minBet) {
      return [{ type: 'color', target: 'red', amount: minBet, displayName: `Red (${minBet})` }];
    }
    return [];
  }
}

export class BetOnEvenStrategy implements IBettingStrategy {
  name = "Bet on Even";
  description = "Places a fixed bet on Even numbers.";
  generateBets(currentBalance: number, minBet: number): IBet[] {
    if (currentBalance >= minBet) {
      return [{ type: 'parity', target: 'even', amount: minBet, displayName: `Even (${minBet})` }];
    }
    return [];
  }
}

export class BetOnSpecificNumberStrategy implements IBettingStrategy {
  name = "Bet on Number 7";
  description = "Places a fixed bet on the number 7.";
  private targetNumber = 7;

  generateBets(currentBalance: number, minBet: number): IBet[] {
    if (currentBalance >= minBet) {
      return [{ type: 'number', target: this.targetNumber, amount: minBet, displayName: `Number ${this.targetNumber} (${minBet})` }];
    }
    return [];
  }
}

// Add more strategies as needed