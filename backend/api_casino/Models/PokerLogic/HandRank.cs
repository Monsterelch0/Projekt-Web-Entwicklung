// CasinoApp/Models/PokerLogic/HandRank.cs
namespace CasinoApp.Models.PokerLogic
{
    public enum HandRank
    {
        HighCard = 1,       // Höchste Karte
        OnePair = 2,        // Ein Paar
        TwoPair = 3,        // Zwei Paare
        ThreeOfAKind = 4,   // Drilling
        Straight = 5,       // Straße
        Flush = 6,          // Flush (Farbe)
        FullHouse = 7,      // Full House (Drilling und Paar)
        FourOfAKind = 8,    // Vierling
        StraightFlush = 9,  // Straight Flush (Straße in einer Farbe)
        RoyalFlush = 10     // Royal Flush (10 bis Ass in einer Farbe) - höchste Hand
    }
}