using CasinoApp.Models;

namespace CasinoApp.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        void Add(User user);
    }
}
