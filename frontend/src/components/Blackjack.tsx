// src/components/Blackjack.tsx
import { useState } from "react";
import "../Blackjack.css";

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];


type Card = {
  suit: string;
  value: string;
};

type Hand = Card[];

function getDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return shuffle(deck);
}

function shuffle(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getCardValue(card: Card): number {
  if (["J", "Q", "K"].includes(card.value)) return 10;
  if (card.value === "A") return 11;
  return parseInt(card.value);
}

function calculateHandValue(hand: Hand): number {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    const val = getCardValue(card);
    total += val;
    if (card.value === "A") aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

export default function BlackjackGame() {
  const [deck, setDeck] = useState<Card[]>(getDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameOver, setGameOver] = useState(true);
  const [message, setMessage] = useState("");
  const [showDealerHand, setShowDealerHand] = useState(false);
  const [balance, setBalance] = useState<number>(100);


  const deal = () => {
    if (!gameOver) {
      setMessage("Spiel läuft noch! Bitte beende das aktuelle Spiel.");
      return;
    }
    if (balance < 10) {
      setMessage("Nicht genug Coins zum Spielen!");
      return;
    }

    const newDeck = getDeck();
    const player: Card[] = [newDeck.pop()!, newDeck.pop()!];
    const dealer: Card[] = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setGameOver(false);
    setMessage("");
    setShowDealerHand(false);
    setBalance(balance - 10);
  };

  const hit = () => {
    if (gameOver) return;

    const newDeck = [...deck];
    const newPlayerHand = [...playerHand, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);

    const playerTotal = calculateHandValue(newPlayerHand);
    if (playerTotal > 21) {
      setMessage("Bust! Dealer gewinnt.");
      setGameOver(true);
      setShowDealerHand(true);
    }
  };

  const stand = () => {
    if (gameOver) return;

    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    while (calculateHandValue(newDealerHand) < 17) {
      const card = newDeck.pop();
      if (card) newDealerHand.push(card);
    }

    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(newDealerHand);

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setGameOver(true);
    setShowDealerHand(true);

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      setMessage("Spieler gewinnt!");
      setBalance(balance + 20);
    } else if (playerTotal < dealerTotal) {
      setMessage("Dealer gewinnt.");
    } else {
      setMessage("Unentschieden (Push).");
      setBalance(balance + 10); 
    }
  };

  const renderCard = (card: Card | null, index: number) => {
    if (!card) {
      return (
        <div key={index} className="card back">
          🂠
        </div>
      );
    }

    const isRed = card.suit === "♥" || card.suit === "♦";
    const cardClass = isRed ? "card red" : "card";

    return (
      <div key={index} className={cardClass}>
        {card.value}
        {card.suit}
      </div>
    );
  };

  return (
    <div className="blackjack-container">
      <h1 className="title">🃏 Blackjack</h1>

      <div className="balance">Coins: {balance}</div>

      <div className="section">
        <h2>Dealer</h2>
        <div className="hand">
          {dealerHand.map((card, i) =>
            showDealerHand || i === 0 ? renderCard(card, i) : renderCard(null, i)
          )}
        </div>
        {showDealerHand && <div className="score">Count: {calculateHandValue(dealerHand)}</div>}
      </div>

      <div className="section">
        <h2>Player</h2>
        <div className="hand">{playerHand.map((card, i) => renderCard(card, i))}</div>
        <div className="score">Count: {calculateHandValue(playerHand)}</div>
      </div>

      <div className="message">{message}</div>

      <div className="buttons">
        <button onClick={deal} disabled={!gameOver || balance < 10}>
          Deal
        </button>
        <button onClick={hit} disabled={gameOver}>
          Hit
        </button>
        <button onClick={stand} disabled={gameOver}>
          Stand
        </button>
      </div>
    </div>
  );
}
