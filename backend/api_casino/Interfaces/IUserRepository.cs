using CasinoApp.Models;

namespace CasinoApp.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task UpdateUser(User user);
        void Add(User user);
    }
}
