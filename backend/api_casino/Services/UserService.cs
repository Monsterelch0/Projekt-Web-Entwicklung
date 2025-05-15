using BCrypt.Net;
using CasinoApp.Interfaces;
using CasinoApp.Models;

namespace CasinoApp.Services
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> LoginAsync(string email, string password)
        {
            var hash = await _unitOfWork.Users.GetPasswordHashByEmailAsync(email);
            return hash != null && BCrypt.Net.BCrypt.Verify(password, hash);
        }

        public async Task RegisterAsync(User user, string plainPassword)
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            _unitOfWork.Users.Add(user);
            await _unitOfWork.CompleteAsync();
        }
    }
}
