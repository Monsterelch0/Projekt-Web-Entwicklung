namespace CasinoApp.Models
{
    public class Card
    {
        public Suit Suit { get; }
        public Rank Rank { get; }

        
        internal Card(Suit suit, Rank rank)
        {
            Suit = suit;
            Rank = rank;
        }

        
        public override string ToString()
        {
            
            string rankString = (int)Rank <= 10 ? ((int)Rank).ToString() : Rank.ToString();
            return $"{rankString} of {Suit}";
        }

      
    }
}