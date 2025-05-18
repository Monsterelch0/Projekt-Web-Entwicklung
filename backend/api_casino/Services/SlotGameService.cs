using System;
using System.Collections.Generic;

namespace api_casino.Services
{
    public class SlotGameService
    {
        private readonly string[] symbols = new[] { "🍒", "🔔", "💎", "🍋", "⭐", "7️⃣" };
        private readonly Random random = new();

        public SlotSpinResult Spin(int betAmount)
        {
            var grid = new string[3, 3];

            // Fill a 3x3 grid with random symbols
            for (int row = 0; row < 3; row++)
            {
                for (int col = 0; col < 3; col++)
                {
                    grid[row, col] = symbols[random.Next(symbols.Length)];
                }
            }

            
            int totalWin = 0;
            for (int row = 0; row < 3; row++)
            {
                if (grid[row, 0] == grid[row, 1] && grid[row, 1] == grid[row, 2])
                {
                    totalWin += betAmount * 5; // payout
                }
            }

            return new SlotSpinResult
            {
                Grid = grid,
                WinAmount = totalWin
            };
        }
    }

    public class SlotSpinResult
    {
        public string[,] Grid { get; set; }
        public int WinAmount { get; set; }
    }
}