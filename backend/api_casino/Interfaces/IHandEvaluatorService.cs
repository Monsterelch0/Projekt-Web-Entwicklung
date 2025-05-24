// CasinoApp/Interfaces/IHandEvaluatorService.cs
using CasinoApp.Models.PokerLogic; // Für EvaluatedHand
using CasinoApp.Models;         // Für Card
using System.Collections.Generic;

namespace CasinoApp.Interfaces
{
	public interface IHandEvaluatorService
	{
		EvaluatedHand EvaluateHand(List<Card> fiveCardHand);
	}
}