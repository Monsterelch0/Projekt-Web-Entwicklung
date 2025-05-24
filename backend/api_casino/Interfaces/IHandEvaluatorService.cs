// CasinoApp/Interfaces/IHandEvaluatorService.cs
using CasinoApp.Models.PokerLogic; // F�r EvaluatedHand
using CasinoApp.Models;         // F�r Card
using System.Collections.Generic;

namespace CasinoApp.Interfaces
{
	public interface IHandEvaluatorService
	{
		EvaluatedHand EvaluateHand(List<Card> fiveCardHand);
	}
}