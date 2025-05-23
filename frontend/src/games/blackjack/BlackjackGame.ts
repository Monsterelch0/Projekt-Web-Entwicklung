// src/games/blackjack/BlackjackGame.ts
export type Card = {
  suit: string;
  rank: string;
  value: number;
  isHidden?: boolean; // For dealer's first card
};
export type PlayerHand = Card[];

// Observer Interface
export interface IObserver {
  update(subject: BlackjackGameManager): void;
}

// Subject (Observable) Class
export class BlackjackGameManager {
  private observers: IObserver[] = [];

  // Game state properties that Observers might be interested in
  public playerHand: PlayerHand = [];
  public dealerHand: PlayerHand = [];
  public playerScore: number = 0;
  public dealerScore: number = 0; // True dealer score
  public displayedDealerScore: number = 0; // Score based on visible cards
  public deck: Card[] = [];
  public message: string = "Welcome to Blackjack! Press 'Deal' to start.";
  public isPlayerTurn: boolean = false;
  public isGameOver: boolean = false;
  public showDealerFirstCard: boolean = false; // Controls visibility of dealer's hole card

  // --- Observer Pattern Methods ---
  public addObserver(observer: IObserver): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    }
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // Notifies all registered observers about a state change.
  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
  // --- End Observer Pattern Methods ---

  private createDeck(): Card[] {
    const suits = ['♥', '♦', '♣', '♠']; // Hearts, Diamonds, Clubs, Spades
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']; // T=Ten, J,Q,K=10, A=11/1
    const deck: Card[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        let value = parseInt(rank);
        if (['T', 'J', 'Q', 'K'].includes(rank)) value = 10;
        if (rank === 'A') value = 11; // Ace is initially 11
        deck.push({ suit, rank, value });
      }
    }
    return deck;
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]; // Swap
    }
  }

  private calculateHandScore(hand: PlayerHand, ignoreHiddenCard: boolean = false): number {
    let score = 0;
    let aceCount = 0;
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if (ignoreHiddenCard && i === 0 && card.isHidden) { // Assuming first card can be hidden
            continue;
        }
        score += card.value;
        if (card.rank === 'A') aceCount++;
    }
    // Adjust for Aces if score is over 21
    while (score > 21 && aceCount > 0) {
      score -= 10; // Change Ace value from 11 to 1
      aceCount--;
    }
    return score;
  }

  private dealCard(hand: PlayerHand, isHidden: boolean = false): void {
    if (this.deck.length > 0) {
      const card = this.deck.pop()!;
      card.isHidden = isHidden;
      hand.push(card);
    }
  }

  // --- Game Actions that modify state and notify observers ---
  public dealInitial(): void {
    this.deck = this.createDeck();
    this.shuffleDeck();

    this.playerHand = [];
    this.dealerHand = [];

    // Deal cards: Player, Dealer (hidden), Player, Dealer (visible)
    this.dealCard(this.playerHand);
    this.dealCard(this.dealerHand, true); // Dealer's first card is hidden
    this.dealCard(this.playerHand);
    this.dealCard(this.dealerHand);

    this.playerScore = this.calculateHandScore(this.playerHand);
    this.dealerScore = this.calculateHandScore(this.dealerHand); // Actual dealer score
    this.displayedDealerScore = this.calculateHandScore(this.dealerHand, true); // Score of visible dealer cards

    this.isPlayerTurn = true;
    this.isGameOver = false;
    this.showDealerFirstCard = false;

    if (this.playerScore === 21) { // Player Blackjack
      this.message = "Blackjack! Player wins!";
      this.isPlayerTurn = false;
      this.isGameOver = true;
      this.showDealerFirstCard = true; // Reveal dealer's card
    } else {
      this.message = "Player's turn. Hit or Stand?";
    }
    this.notifyObservers(); // Notify after state changes
  }

  public hit(): void {
    if (!this.isPlayerTurn || this.isGameOver) return;

    this.dealCard(this.playerHand);
    this.playerScore = this.calculateHandScore(this.playerHand);

    if (this.playerScore > 21) {
      this.message = `Player busts with ${this.playerScore}! Dealer wins.`;
      this.isPlayerTurn = false;
      this.isGameOver = true;
      this.showDealerFirstCard = true;
    } else if (this.playerScore === 21) {
      this.message = "Player has 21! Now it's dealer's turn.";
      // Automatically stand if player hits 21, then proceed to dealer's turn
      this.stand(); // This will change turn and trigger dealer logic
      return; // stand() will notify
    } else {
      this.message = "Player hits. Hit or Stand?";
    }
    this.notifyObservers();
  }

  public stand(): void {
    if (!this.isPlayerTurn || this.isGameOver) return;

    this.isPlayerTurn = false;
    this.showDealerFirstCard = true; // Reveal dealer's hole card
    this.displayedDealerScore = this.calculateHandScore(this.dealerHand, false); // Update displayed score
    this.message = "Dealer's turn.";
    this.notifyObservers(); // Notify that it's dealer's turn and card is revealed

    // Dealer plays after a short delay for user to see revealed card
    setTimeout(() => {
      this.dealerPlay();
    }, 1000);
  }

  private dealerPlay(): void {
    // Dealer hits until score is 17 or more, or busts
    while (this.dealerScore < 17 && this.deck.length > 0) {
      this.dealCard(this.dealerHand);
      this.dealerScore = this.calculateHandScore(this.dealerHand);
      this.displayedDealerScore = this.dealerScore; // Update displayed score
      this.notifyObservers(); // Notify after each dealer card if desired, or just at the end
    }

    if (this.dealerScore > 21) {
      this.message = `Dealer busts with ${this.dealerScore}! Player wins.`;
    } else if (this.dealerScore > this.playerScore) {
      this.message = `Dealer wins with ${this.dealerScore} vs Player's ${this.playerScore}.`;
    } else if (this.playerScore > this.dealerScore) {
      this.message = `Player wins with ${this.playerScore} vs Dealer's ${this.dealerScore}!`;
    } else { // Scores are equal
      this.message = `Push! Both have ${this.playerScore}.`;
    }
    this.isGameOver = true;
    this.notifyObservers(); // Final notification
  }
}