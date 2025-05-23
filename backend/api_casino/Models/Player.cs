using System.Collections.Generic;

namespace CasinoApp.Models
{
    public class Player
    {
        public string Id { get; set; }
        public List<Card> Hand { get; private set; }
        public int Chips { get; set; }
        public bool IsAI { get; set; }
        public bool IsActive { get; set; }

        public Player(string id, int initialChips, bool isAI = false)
        {
            Id = id;
            Chips = initialChips;
            IsAI = isAI;
            Hand = new List<Card>();
            IsActive = true;
        }

        public void AddCardToHand(Card card)
        {
            Hand.Add(card);
        }

        public void ClearHand()
        {
            Hand.Clear();
        }
    }
}