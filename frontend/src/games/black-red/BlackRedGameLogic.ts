// src/games/black-red/BlackRedGameLogic.ts

export type CardColor = 'red' | 'black';

export class BlackRedGameLogic {
  private deck: string[] = [];
  public revealedCards: string[] = [];
  public score: number = 10;
  public message: string = "Click 'Start Game' to begin!";
  public gameOver: boolean = true;
  private cardIndex: number = 0;

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck() {
    const suits = ['♥', '♦', '♠', '♣'];
    const values = ['2', '3', '4', '5'];

    this.deck = [];

    for (const suit of suits) {
      for (const value of values) {
        this.deck.push(`${value}${suit}`);
      }
    }

    this.shuffleDeck();
  }

  private shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  private getCardColor(card: string): CardColor {
    const suit = card.slice(-1);
    return suit === '♥' || suit === '♦' ? 'red' : 'black';
  }

  public startGame(): void {
    this.initializeDeck();
    this.revealedCards = [];

    this.revealedCards.push(this.deck[this.cardIndex++]);
    this.revealedCards.push(this.deck[this.cardIndex++]);

    this.score = 10;
    this.gameOver = false;
    this.message = `Two cards revealed. Guess if the next is red or black.`;
  }

  public guess(isRedGuess: boolean): void {
    if (this.gameOver) {
      this.message = "Game is over. Please start a new game.";
      return;
    }

    if (this.cardIndex >= this.deck.length) {
      this.message = `No more cards. You win! Final score: ${this.score}`;
      this.gameOver = true;
      return;
    }

    const nextCard = this.deck[this.cardIndex++];
    const actualColor = this.getCardColor(nextCard);
    const guessedColor: CardColor = isRedGuess ? 'red' : 'black';

    this.revealedCards.push(nextCard);

    if (guessedColor === actualColor) {
      this.score *= 2;
      this.message = `Correct! It was ${nextCard} (${actualColor}). New score: ${this.score}. Guess again!`;
    } else {
      this.message = `Wrong! It was ${nextCard} (${actualColor}). Game Over. Final score: ${this.score}`;
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

// ✅ Ažurirana funkcija za prikaz slika sa numeričkim nazivima fajlova (Opcija 2)
export function mapCardToImageFile(card: string): string {
  const value = card[0]; // npr. '2', '3', '4', '5'

  const suitMap: { [key: string]: string } = {
    '♠': 'spades',
    '♣': 'clubs',
    '♥': 'hearts',
    '♦': 'diamonds',
  };

  const suit = suitMap[card.slice(-1)];

  return `/images/cards/${value}_of_${suit}.png`;
}
