using Microsoft.AspNetCore.Mvc;
using api_casino.Services;

namespace api_casino.Controllers
{
    [ApiController]
    [Route("api/slot")]
    public class SlotGameController : ControllerBase
    {
        private readonly SlotGameService _slotGameService;

        public SlotGameController()
        {
            _slotGameService = new SlotGameService();
        }

        [HttpPost("spin")]
        public ActionResult<SlotSpinResult> Spin([FromQuery] int bet = 10)
        {
            var result = _slotGameService.Spin(bet);
            return Ok(result);
        }
    }
}