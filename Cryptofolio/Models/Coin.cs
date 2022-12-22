using System.ComponentModel.DataAnnotations;

namespace Cryptofolio.Models
{
    public class Coin
    {
        public Coin()
        {
            Comments= new List<Comment>();
            Watchlists= new List<Watchlist>();
            VotingHistories = new List<VotingHistory>();
        }

        [Key]
        public string Symbol { get; set; } = string.Empty;

        public List<Comment> Comments { get; set; }

        public List<Watchlist> Watchlists { get; set; }

        public List<VotingHistory> VotingHistories { get; set; }
    }
}
