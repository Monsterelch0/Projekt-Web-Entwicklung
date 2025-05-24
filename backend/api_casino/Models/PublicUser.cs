namespace CasinoApp.Models {
    // Subset of properties from User object that can safely be exposed to clients
    public class PublicUser
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public decimal Balance { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; }

        public PublicUser(User user) {
            this.UserId = user.UserId;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.Email = user.Email;
            this.Balance = user.Balance;
            this.CreatedAt = user.CreatedAt;
            this.IsActive = user.IsActive;
        }
    }
}
