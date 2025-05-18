using Microsoft.AspNetCore.Mvc;
using CasinoApp.Models;
using CasinoApp.Interfaces;

namespace CasinoApp.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetUser(string email)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            return user == null ? NotFound() : Ok(user);
        }
    }
}
